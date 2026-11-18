import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { BadRequestException, ConflictException, UnauthorizedException } from "@nestjs/common";

describe("AuthService Unit Suite (IAM, Argon2id & Token Rotation)", () => {
  let authService: AuthService;
  let fakePrisma: any;
  let jwtService: JwtService;
  let configService: ConfigService;

  // In-memory mock store
  let users: any[] = [];
  let userProfiles: any[] = [];
  let userSessions: any[] = [];
  let refreshTokens: any[] = [];
  let auditLogs: any[] = [];

  beforeEach(() => {
    users = [];
    userProfiles = [];
    userSessions = [];
    refreshTokens = [];
    auditLogs = [];

    fakePrisma = {
      user: {
        findUnique: async ({ where }: any) => {
          const user = users.find((u) => u.email === where.email || u.id === where.id);
          if (!user) return null;
          const profile = userProfiles.find((p) => p.userId === user.id);
          return { ...user, profile };
        },
        create: async ({ data }: any) => {
          const newUser = {
            id: `usr-${Date.now()}-${Math.random()}`,
            email: data.email,
            fullName: data.fullName,
            passwordHash: data.passwordHash,
            role: data.role || "USER",
            isActive: data.isActive ?? true,
            emailVerified: data.emailVerified ?? false,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          users.push(newUser);
          if (data.profile?.create) {
            userProfiles.push({
              id: `prof-${Date.now()}`,
              userId: newUser.id,
              ...data.profile.create,
              updatedAt: new Date(),
            });
          }
          const profile = userProfiles.find((p) => p.userId === newUser.id);
          return { ...newUser, profile };
        },
        update: async ({ where, data }: any) => {
          const idx = users.findIndex((u) => u.id === where.id);
          if (idx !== -1) {
            users[idx] = { ...users[idx], ...data, updatedAt: new Date() };
            return users[idx];
          }
          return null;
        },
      },
      userProfile: {
        upsert: async ({ where, create, update }: any) => {
          let prof = userProfiles.find((p) => p.userId === where.userId);
          if (prof) {
            Object.assign(prof, update, { updatedAt: new Date() });
          } else {
            prof = {
              id: `prof-${Date.now()}`,
              userId: where.userId,
              ...create,
              updatedAt: new Date(),
            };
            userProfiles.push(prof);
          }
          return prof;
        },
      },
      userSession: {
        create: async ({ data }: any) => {
          const session = {
            id: `ses-${Date.now()}-${Math.random()}`,
            userId: data.userId,
            familyId: data.familyId,
            ipAddress: data.ipAddress,
            userAgent: data.userAgent,
            isRevoked: false,
            createdAt: new Date(),
            lastActiveAt: new Date(),
            expiresAt: data.expiresAt,
          };
          userSessions.push(session);
          if (data.refreshTokens?.create) {
            refreshTokens.push({
              id: `tok-${Date.now()}`,
              userId: data.userId,
              sessionId: session.id,
              familyId: data.familyId,
              tokenHash: data.refreshTokens.create.tokenHash,
              isRotated: false,
              isRevoked: false,
              expiresAt: data.refreshTokens.create.expiresAt,
              createdAt: new Date(),
            });
          }
          return session;
        },
        findUnique: async ({ where }: any) => {
          return userSessions.find((s) => s.id === where.id) || null;
        },
        findFirst: async ({ where }: any) => {
          return (
            userSessions.find(
              (s) =>
                (!where.id || s.id === where.id) && (!where.userId || s.userId === where.userId)
            ) || null
          );
        },
        findMany: async ({ where }: any) => {
          return userSessions.filter(
            (s) => s.userId === where.userId && s.isRevoked === where.isRevoked
          );
        },
        update: async ({ where, data }: any) => {
          const session = userSessions.find((s) => s.id === where.id);
          if (session) Object.assign(session, data);
          return session;
        },
        updateMany: async ({ where, data }: any) => {
          let count = 0;
          for (const s of userSessions) {
            const matchesId = !where.id || s.id === where.id;
            const matchesFamily = !where.familyId || s.familyId === where.familyId;
            const matchesUser = !where.userId || s.userId === where.userId;
            const matchesRevoked = where.isRevoked === undefined || s.isRevoked === where.isRevoked;

            if (matchesId && matchesFamily && matchesUser && matchesRevoked) {
              Object.assign(s, data);
              count++;
            }
          }
          return { count };
        },
      },
      refreshToken: {
        create: async ({ data }: any) => {
          const tok = {
            id: `tok-${Date.now()}-${Math.random()}`,
            ...data,
            isRotated: false,
            isRevoked: false,
            createdAt: new Date(),
          };
          refreshTokens.push(tok);
          return tok;
        },
        findUnique: async ({ where }: any) => {
          const tok = refreshTokens.find((t) => t.tokenHash === where.tokenHash);
          if (!tok) return null;
          const user = users.find((u) => u.id === tok.userId);
          const profile = user ? userProfiles.find((p) => p.userId === user.id) : null;
          const session = userSessions.find((s) => s.id === tok.sessionId);
          return {
            ...tok,
            user: user ? { ...user, profile } : null,
            session: session || null,
          };
        },
        update: async ({ where, data }: any) => {
          const tok = refreshTokens.find((t) => t.id === where.id);
          if (tok) Object.assign(tok, data);
          return tok;
        },
        updateMany: async ({ where, data }: any) => {
          let count = 0;
          for (const t of refreshTokens) {
            if (
              (!where.id || t.id === where.id) &&
              (!where.familyId || t.familyId === where.familyId) &&
              (!where.userId || t.userId === where.userId) &&
              (!where.sessionId || t.sessionId === where.sessionId) &&
              (where.isRotated === undefined || t.isRotated === where.isRotated) &&
              (where.isRevoked === undefined || t.isRevoked === where.isRevoked)
            ) {
              Object.assign(t, data);
              count++;
            }
          }
          return { count };
        },
      },
      systemAuditLog: {
        create: async ({ data }: any) => {
          auditLogs.push(data);
          return data;
        },
      },
      $transaction: async (arg: any) => {
        if (typeof arg === "function") {
          return arg(fakePrisma);
        }
        return Promise.all(arg);
      },
    };

    jwtService = new JwtService({ secret: "test-secret-key-32-chars-length!!" });
    configService = new ConfigService({
      JWT_SECRET: "test-secret-key-32-chars-length!!",
    });

    authService = new AuthService(fakePrisma as any, jwtService, configService);
  });

  it("should reject registration if password does not meet strength policy", async () => {
    await assert.rejects(
      async () => {
        await authService.register({
          email: "user@ana-orthodox.dev",
          password: "weak",
          fullName: "User Test",
        });
      },
      (err: any) => {
        assert.ok(err instanceof BadRequestException);
        assert.ok((err.getResponse() as any).errors.length > 0);
        return true;
      }
    );
  });

  it("should successfully register a user, hash with Argon2id, and create session with opaque token", async () => {
    const result = await authService.register({
      email: "Abanoub@Ana-Orthodox.DEV",
      password: "StrongP@ssw0rd2026",
      fullName: "أبانوب المعترف",
    });

    assert.ok(result.accessToken);
    assert.ok(result.rawRefreshToken);
    assert.strictEqual(result.user.email, "abanoub@ana-orthodox.dev");
    assert.strictEqual(result.user.fullName, "أبانوب المعترف");
    assert.strictEqual(result.user.role, "USER");
    assert.strictEqual(result.user.preferences.preferredTheme, "system");
    assert.strictEqual(result.user.preferences.tashkeelEnabled, true);

    // Verify stored user password hash is argon2id
    const stored = users[0];
    assert.ok(stored.passwordHash.startsWith("$argon2id$"));

    // Verify raw refresh token is NOT in database, only SHA-256 hash
    const expectedHash = authService.hashToken(result.rawRefreshToken);
    const tokenRecord = refreshTokens.find((t) => t.tokenHash === expectedHash);
    assert.ok(tokenRecord);
    assert.strictEqual(tokenRecord.isRotated, false);
    assert.strictEqual(tokenRecord.isRevoked, false);
  });

  it("should reject duplicate email registration with ConflictException", async () => {
    await authService.register({
      email: "duplicate@ana-orthodox.dev",
      password: "StrongP@ssw0rd2026",
      fullName: "First User",
    });

    await assert.rejects(
      async () => {
        await authService.register({
          email: "DUPLICATE@ana-orthodox.dev",
          password: "StrongP@ssw0rd2026",
          fullName: "Second User",
        });
      },
      (err: any) => {
        assert.ok(err instanceof ConflictException);
        return true;
      }
    );
  });

  it("should authenticate valid user on login and issue new session and tokens", async () => {
    await authService.register({
      email: "login@ana-orthodox.dev",
      password: "StrongP@ssw0rd2026",
      fullName: "Login Test",
    });

    const loginResult = await authService.login({
      email: "login@ana-orthodox.dev",
      password: "StrongP@ssw0rd2026",
    });

    assert.ok(loginResult.accessToken);
    assert.ok(loginResult.rawRefreshToken);
    assert.strictEqual(loginResult.user.email, "login@ana-orthodox.dev");
  });

  it("should return generic UnauthorizedException on wrong password (anti-enumeration)", async () => {
    await authService.register({
      email: "anti-enum@ana-orthodox.dev",
      password: "StrongP@ssw0rd2026",
      fullName: "Enum Test",
    });

    await assert.rejects(
      async () => {
        await authService.login({
          email: "anti-enum@ana-orthodox.dev",
          password: "WrongPassword123!",
        });
      },
      (err: any) => {
        assert.ok(err instanceof UnauthorizedException);
        assert.ok(err.message.includes("بيانات الاعتماد غير صحيحة"));
        return true;
      }
    );
  });

  it("should rotate refresh token and issue new token on valid refresh", async () => {
    const reg = await authService.register({
      email: "refresh@ana-orthodox.dev",
      password: "StrongP@ssw0rd2026",
      fullName: "Refresh Test",
    });

    const oldRawToken = reg.rawRefreshToken;
    const oldHash = authService.hashToken(oldRawToken);

    const refreshResult = await authService.refresh(oldRawToken);
    assert.ok(refreshResult.accessToken);
    assert.ok(refreshResult.rawRefreshToken);
    assert.notStrictEqual(refreshResult.rawRefreshToken, oldRawToken);

    // Old token must be marked as rotated
    const oldRecord = refreshTokens.find((t) => t.tokenHash === oldHash);
    assert.strictEqual(oldRecord.isRotated, true);

    // New token must exist and not be rotated
    const newHash = authService.hashToken(refreshResult.rawRefreshToken);
    const newRecord = refreshTokens.find((t) => t.tokenHash === newHash);
    assert.ok(newRecord);
    assert.strictEqual(newRecord.isRotated, false);
    assert.strictEqual(newRecord.familyId, oldRecord.familyId);
  });

  it("CRITICAL SECURITY: should detect rotated token reuse and revoke ENTIRE family", async () => {
    const reg = await authService.register({
      email: "reuse@ana-orthodox.dev",
      password: "StrongP@ssw0rd2026",
      fullName: "Reuse Test",
    });

    const initialToken = reg.rawRefreshToken;

    // Normal refresh rotates initialToken
    const firstRefresh = await authService.refresh(initialToken);
    assert.ok(firstRefresh.rawRefreshToken);

    // Attacker or replayed request tries to use initialToken AGAIN
    await assert.rejects(
      async () => {
        await authService.refresh(initialToken);
      },
      (err: any) => {
        assert.ok(err instanceof UnauthorizedException);
        assert.ok(err.message.includes("تم اكتشاف نشاط غير مصرح به"));
        return true;
      }
    );

    // Verify ALL tokens in that family were revoked
    const familyTokens = refreshTokens.filter((t) => t.familyId === refreshTokens[0].familyId);
    assert.ok(familyTokens.every((t) => t.isRevoked === true));

    // Verify session was revoked
    assert.strictEqual(userSessions[0].isRevoked, true);

    // Verify security audit log was written
    assert.ok(auditLogs.some((l) => l.action === "SECURITY_TOKEN_REUSE_DETECTED"));
  });

  it("should revoke all sessions on logoutAll", async () => {
    const reg = await authService.register({
      email: "logoutall@ana-orthodox.dev",
      password: "StrongP@ssw0rd2026",
      fullName: "Logout All Test",
    });

    await authService.logoutAll(reg.user.id);

    assert.ok(userSessions.every((s) => s.isRevoked === true));
    assert.ok(refreshTokens.every((t) => t.isRevoked === true));
  });

  it("should update user profile preferences", async () => {
    const reg = await authService.register({
      email: "profile@ana-orthodox.dev",
      password: "StrongP@ssw0rd2026",
      fullName: "Profile Test",
    });

    const updated = await authService.updateProfile(reg.user.id, {
      fullName: "الأنبا أنطونيوس",
      preferredTheme: "dark",
      fontSize: 24,
      tashkeelEnabled: false,
    });

    assert.strictEqual(updated.fullName, "الأنبا أنطونيوس");
    assert.strictEqual(updated.preferences.preferredTheme, "dark");
    assert.strictEqual(updated.preferences.fontSize, 24);
    assert.strictEqual(updated.preferences.tashkeelEnabled, false);
  });

  it("CRITICAL SECURITY: should prevent concurrent refresh race condition and revoke family if second update fails", async () => {
    const reg = await authService.register({
      email: "concurrency@ana-orthodox.dev",
      password: "StrongP@ssw0rd2026",
      fullName: "Concurrency Test",
    });

    const token = reg.rawRefreshToken;

    // First refresh succeeds
    const res1 = await authService.refresh(token);
    assert.ok(res1.accessToken);

    // Concurrent / replay attempt fails and triggers family revocation
    await assert.rejects(
      async () => {
        await authService.refresh(token);
      },
      (err: any) => {
        assert.ok(err instanceof UnauthorizedException);
        return true;
      }
    );
  });

  it("should verify session validity and report active vs revoked state (isSessionActive)", async () => {
    const reg = await authService.register({
      email: "session-check@ana-orthodox.dev",
      password: "StrongP@ssw0rd2026",
      fullName: "Session Check",
    });

    // Obtain session
    const sessions = await authService.getSessions(reg.user.id);
    assert.strictEqual(sessions.length, 1);
    const sessionId = sessions[0]!.id;

    // Active session returns true
    const isActiveBefore = await authService.isSessionActive(sessionId);
    assert.strictEqual(isActiveBefore, true);

    // Revoke session
    await authService.revokeSession(reg.user.id, sessionId);

    // Inactive / revoked session returns false
    const isActiveAfter = await authService.isSessionActive(sessionId);
    assert.strictEqual(isActiveAfter, false);

    // Non-existent session returns false
    const nonExistent = await authService.isSessionActive("non-existent-session-id");
    assert.strictEqual(nonExistent, false);
  });

  it("should invalidate active session on logout and logoutAll", async () => {
    const reg = await authService.register({
      email: "logout-session@ana-orthodox.dev",
      password: "StrongP@ssw0rd2026",
      fullName: "Logout Session",
    });

    const sessions = await authService.getSessions(reg.user.id);
    const sessionId = sessions[0]!.id;
    assert.strictEqual(await authService.isSessionActive(sessionId), true);

    // Logout with refresh token
    await authService.logout(reg.rawRefreshToken);
    assert.strictEqual(await authService.isSessionActive(sessionId), false);

    // Login again to get new session
    await authService.login({
      email: "logout-session@ana-orthodox.dev",
      password: "StrongP@ssw0rd2026",
    });
    const newSessions = await authService.getSessions(reg.user.id);
    assert.strictEqual(newSessions.length, 1);
    const newSessionId = newSessions[0]!.id;
    assert.strictEqual(await authService.isSessionActive(newSessionId), true);

    // Logout all
    await authService.logoutAll(reg.user.id);
    assert.strictEqual(await authService.isSessionActive(newSessionId), false);
  });
});
