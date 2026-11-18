import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import cookieParser from "cookie-parser";
import { AuthModule } from "./auth.module";
import { AuthService } from "./auth.service";
import { TransformInterceptor } from "../../common/interceptors/transform.interceptor";
import { AllExceptionsFilter } from "../../common/filters/http-exception.filter";

describe("Auth HTTP Integration Suite (Real Network & Pipeline)", () => {
  let app: INestApplication;
  let baseUrl: string;
  let jwtService: JwtService;
  const activeSessions = new Set<string>();

  const mockAuthService = {
    isSessionActive: async (sessionId: string) => activeSessions.has(sessionId),
    register: async (dto: any) => ({
      user: {
        id: "mock-user-123",
        email: dto.email,
        fullName: dto.fullName,
        role: "USER",
        isActive: true,
        emailVerified: false,
        createdAt: new Date().toISOString(),
        preferences: {
          preferredTheme: "system",
          fontSize: 18,
          tashkeelEnabled: true,
          copticScript: true,
        },
      },
      accessToken: "mock.valid.jwt.token",
      rawRefreshToken: "mock_opaque_raw_refresh_token_32_bytes",
    }),
    login: async (dto: any) => ({
      user: {
        id: "mock-user-123",
        email: dto.email,
        fullName: "Test User",
        role: "USER",
        isActive: true,
        emailVerified: false,
        createdAt: new Date().toISOString(),
        preferences: {
          preferredTheme: "system",
          fontSize: 18,
          tashkeelEnabled: true,
          copticScript: true,
        },
      },
      accessToken: "mock.valid.jwt.token",
      rawRefreshToken: "mock_opaque_raw_refresh_token_32_bytes",
    }),
    refresh: async (token?: string) => {
      if (!token) throw new UnauthorizedException("Missing token");
      return {
        user: { id: "mock-user-123" },
        accessToken: "mock.new.jwt.token",
        rawRefreshToken: "mock_new_raw_token",
      };
    },
    logout: async () => ({ success: true }),
    getMe: async (userId: string) => ({
      id: userId,
      email: "authenticated@ana-orthodox.dev",
      fullName: "Auth User",
      role: "USER",
      isActive: true,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      preferences: {
        preferredTheme: "system",
        fontSize: 18,
        tashkeelEnabled: true,
        copticScript: true,
      },
    }),
  };

  before(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    jwtService = moduleRef.get(JwtService);
    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix("api/v1");
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(new TransformInterceptor());

    await app.listen(0);
    const server = app.getHttpServer();
    const address = server.address();
    const port = typeof address === "object" && address ? address.port : 0;
    baseUrl = `http://localhost:${port}/api/v1`;
  });

  after(async () => {
    if (app) {
      await app.close();
    }
  });

  it("GET /api/v1/auth/me should return HTTP 401 when unauthenticated", async () => {
    const response = await fetch(`${baseUrl}/auth/me`);
    assert.strictEqual(response.status, 401);

    const json = (await response.json()) as any;
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, "ANA-HTTP-401");
  });

  it("POST /api/v1/auth/register should fail with HTTP 400 when body is invalid", async () => {
    const response = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "not-an-email", password: "short" }),
    });

    assert.strictEqual(response.status, 400);
    const json = (await response.json()) as any;
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, "ANA-HTTP-400");
  });

  it("POST /api/v1/auth/register should return HTTP 201 and set Set-Cookie header", async () => {
    const response = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "servant@ana-orthodox.dev",
        password: "StrongP@ssw0rd2026",
        fullName: "خادم كنسي",
      }),
    });

    assert.strictEqual(response.status, 201);
    const setCookie = response.headers.get("set-cookie");
    assert.ok(setCookie);
    assert.ok(setCookie.includes("ana_refresh_token="));
    assert.ok(setCookie.includes("HttpOnly"));

    const json = (await response.json()) as any;
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.accessToken, "mock.valid.jwt.token");
    assert.strictEqual(json.data.expiresIn, 900);
    assert.strictEqual(json.data.user.email, "servant@ana-orthodox.dev");
  });

  it("POST /api/v1/auth/refresh should fail with 401 if refresh cookie is missing", async () => {
    const response = await fetch(`${baseUrl}/auth/refresh`, {
      method: "POST",
    });

    assert.strictEqual(response.status, 401);
    const json = (await response.json()) as any;
    assert.strictEqual(json.success, false);
  });

  it("POST /api/v1/auth/register should reject mass assignment of unauthorized role", async () => {
    const response = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "attacker@ana-orthodox.dev",
        password: "StrongP@ssw0rd2026",
        fullName: "Privilege Escalator",
        role: "ADMINISTRATOR", // Forbidden non-whitelisted property
      }),
    });

    assert.strictEqual(response.status, 400);
    const json = (await response.json()) as any;
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, "ANA-HTTP-400");
  });

  it("POST /api/v1/auth/refresh should reject request from untrusted origin (CSRF defense)", async () => {
    const response = await fetch(`${baseUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        Origin: "http://malicious-cross-origin.com",
      },
    });

    assert.strictEqual(response.status, 403);
    const json = (await response.json()) as any;
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, "ANA-HTTP-403");
  });

  it("POST /api/v1/auth/refresh should reject Origin: 'null' with 403 (Sandboxed Iframe CSRF Defense)", async () => {
    const response = await fetch(`${baseUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        Origin: "null",
      },
    });

    assert.strictEqual(response.status, 403);
    const json = (await response.json()) as any;
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, "ANA-HTTP-403");
  });

  it("ACCESS TOKEN REVOCATION: valid JWT must be immediately rejected with 401 when session is revoked", async () => {
    const sessionId = "revoked-test-session-123";
    activeSessions.add(sessionId);

    const token = await jwtService.signAsync({
      sub: "mock-user-123",
      email: "authenticated@ana-orthodox.dev",
      role: "USER",
      sessionId,
    });

    // 1. Calling GET /auth/me with active session succeeds
    const resActive = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.strictEqual(resActive.status, 200);
    const jsonActive = (await resActive.json()) as any;
    assert.strictEqual(jsonActive.success, true);
    assert.strictEqual(jsonActive.data.id, "mock-user-123");

    // 2. Revoke session (e.g. from another client/device, logout, or logout-all)
    activeSessions.delete(sessionId);

    // 3. Immediately call protected API with the exact same access token
    const resRevoked = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // 4. Record actual HTTP result: must be HTTP 401 with session revoked error
    assert.strictEqual(resRevoked.status, 401);
    const jsonRevoked = (await resRevoked.json()) as any;
    assert.strictEqual(jsonRevoked.success, false);
    assert.strictEqual(jsonRevoked.error.code, "ANA-HTTP-401");
    assert.ok(jsonRevoked.error.message.includes("جلسة العمل ملغاة"));
  });
});
