import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

describe("AuthController Unit Suite (HTTP Adapters & Cookies)", () => {
  let controller: AuthController;
  let fakeAuthService: any;

  beforeEach(() => {
    fakeAuthService = {
      register: async () => ({
        accessToken: "mock.access.token",
        rawRefreshToken: "mock_opaque_refresh_token_32_bytes",
        user: { id: "u-1", email: "test@ana-orthodox.dev", fullName: "Test User", role: "USER" },
      }),
      login: async () => ({
        accessToken: "mock.access.token",
        rawRefreshToken: "mock_opaque_refresh_token_32_bytes",
        user: { id: "u-1", email: "test@ana-orthodox.dev", fullName: "Test User", role: "USER" },
      }),
      refresh: async () => ({
        accessToken: "mock.new.token",
        rawRefreshToken: "mock_new_opaque_refresh_token",
        user: { id: "u-1", email: "test@ana-orthodox.dev", fullName: "Test User", role: "USER" },
      }),
      logout: async () => ({ success: true }),
      logoutAll: async () => ({ success: true }),
      getMe: async () => ({ id: "u-1", email: "test@ana-orthodox.dev" }),
      updateProfile: async () => ({ id: "u-1", fullName: "Updated Name" }),
      getSessions: async () => [{ id: "ses-1", isCurrent: true }],
      revokeSession: async () => ({ success: true }),
    };

    controller = new AuthController(fakeAuthService as AuthService);
  });

  it("should set HttpOnly Strict cookie on register and return 900s expiresIn", async () => {
    let cookieName = "";
    let cookieValue = "";
    let cookieOptions: any = {};

    const res: any = {
      cookie: (name: string, val: string, opts: any) => {
        cookieName = name;
        cookieValue = val;
        cookieOptions = opts;
      },
    };
    const req: any = { ip: "127.0.0.1", headers: { "user-agent": "test-agent" }, socket: {} };

    const result = await controller.register(
      { email: "test@ana-orthodox.dev", password: "StrongP@ssw0rd2026", fullName: "Test" },
      req,
      res
    );

    assert.strictEqual(cookieName, "ana_refresh_token");
    assert.strictEqual(cookieValue, "mock_opaque_refresh_token_32_bytes");
    assert.strictEqual(cookieOptions.httpOnly, true);
    assert.strictEqual(cookieOptions.sameSite, "strict");
    assert.strictEqual(cookieOptions.path, "/api/v1/auth");
    assert.strictEqual(result.accessToken, "mock.access.token");
    assert.strictEqual(result.expiresIn, 900);
  });

  it("should set HttpOnly Strict cookie on login", async () => {
    let cookieName = "";
    let cookieOptions: any = {};

    const res: any = {
      cookie: (name: string, _val: string, opts: any) => {
        cookieName = name;
        cookieOptions = opts;
      },
    };
    const req: any = { ip: "127.0.0.1", headers: {}, socket: {} };

    const result = await controller.login(
      { email: "test@ana-orthodox.dev", password: "StrongP@ssw0rd2026" },
      req,
      res
    );

    assert.strictEqual(cookieName, "ana_refresh_token");
    assert.strictEqual(cookieOptions.httpOnly, true);
    assert.strictEqual(result.accessToken, "mock.access.token");
    assert.strictEqual(result.expiresIn, 900);
  });

  it("should clear refresh token cookie on logout", async () => {
    let clearedName = "";
    let clearedOpts: any = {};

    const res: any = {
      clearCookie: (name: string, opts: any) => {
        clearedName = name;
        clearedOpts = opts;
      },
    };
    const req: any = {
      cookies: { ana_refresh_token: "token-to-revoke" },
      headers: {},
    };

    const result = await controller.logout(req, res);

    assert.strictEqual(clearedName, "ana_refresh_token");
    assert.strictEqual(clearedOpts.httpOnly, true);
    assert.strictEqual(clearedOpts.path, "/api/v1/auth");
    assert.strictEqual(result.success, true);
  });

  it("should reject Origin: null with ForbiddenException (sandboxed iframe / CSRF defense)", async () => {
    const res: any = {
      clearCookie: () => {},
    };
    const req: any = {
      cookies: { ana_refresh_token: "token-to-revoke" },
      headers: {
        origin: "null",
      },
    };

    await assert.rejects(
      async () => {
        await controller.logout(req, res);
      },
      (err: any) => {
        assert.strictEqual(err.status, 403);
        assert.ok(err.message.includes("تم رفض الأصل الفارغ"));
        return true;
      }
    );
  });
});
