import { resolveJwtSecret } from "../../config/environment";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as crypto from "node:crypto";
import * as argon2 from "argon2";
import {
  normalizeEmail,
  normalizePassword,
  validatePasswordStrength,
} from "@ana-orthodox/validation";
import { UserProfileDto, UserSessionDto, JwtPayload, UserRole } from "@ana-orthodox/shared-types";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";

export interface RequestMetadata {
  ip?: string;
  userAgent?: string;
}

export interface AuthTokensResult {
  user: UserProfileDto;
  accessToken: string;
  rawRefreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtSecret: string;
  private readonly accessTokenTtl = 900; // 15 minutes in seconds
  private readonly refreshTokenTtlMs = 30 * 24 * 60 * 60 * 1000; // 30 days

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {
    this.jwtSecret =
      resolveJwtSecret(this.configService.get<string>("JWT_SECRET"), process.env.NODE_ENV === "production");
  }

  /**
   * Hashes an opaque token using SHA-256 for secure database storage
   */
  hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  /**
   * Generates a 32-byte cryptographically secure opaque token (base64url)
   */
  generateOpaqueToken(): string {
    return crypto.randomBytes(32).toString("base64url");
  }

  /**
   * Registers a new user account with initial profile, session, and refresh token
   */
  async register(dto: RegisterDto, meta: RequestMetadata = {}): Promise<AuthTokensResult> {
    const email = normalizeEmail(dto.email);
    const normalizedPassword = normalizePassword(dto.password);

    // 1. Validate password strength
    const passwordCheck = validatePasswordStrength(normalizedPassword);
    if (!passwordCheck.valid) {
      throw new BadRequestException({
        message:
          "كلمة المرور لا تستوفي معايير الأمان (Password does not meet security requirements)",
        errors: passwordCheck.reasons,
      });
    }

    // 2. Check for duplicate email
    const existing = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      throw new ConflictException("البريد الإلكتروني مسجل بالفعل (Email already registered)");
    }

    // 3. Hash password with Argon2id (OWASP recommendation)
    const passwordHash = await argon2.hash(normalizedPassword, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });

    // 4. Session & token setup
    const familyId = crypto.randomUUID();
    const rawRefreshToken = this.generateOpaqueToken();
    const tokenHash = this.hashToken(rawRefreshToken);
    const expiresAt = new Date(Date.now() + this.refreshTokenTtlMs);

    // 5. Atomic persistence via Prisma transaction
    const { user, session } = await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email,
          fullName: dto.fullName.trim(),
          passwordHash,
          role: "USER",
          isActive: true,
          emailVerified: false,
          profile: {
            create: {
              preferredTheme: "system",
              fontSize: 18,
              tashkeelEnabled: true,
              copticScript: true,
            },
          },
        },
        include: { profile: true },
      });

      const createdSession = await tx.userSession.create({
        data: {
          userId: createdUser.id,
          familyId,
          ipAddress: meta.ip,
          userAgent: meta.userAgent,
          expiresAt,
        },
      });

      await tx.refreshToken.create({
        data: {
          userId: createdUser.id,
          sessionId: createdSession.id,
          familyId,
          tokenHash,
          expiresAt,
        },
      });

      return { user: createdUser, session: createdSession };
    });

    const accessToken = await this.generateAccessToken(
      user.id,
      user.email,
      user.role as UserRole,
      session.id
    );

    return {
      user: this.mapToUserProfileDto(user),
      accessToken,
      rawRefreshToken,
    };
  }

  /**
   * Authenticates user credentials with constant-time resistance and creates an active session
   */
  async login(dto: LoginDto, meta: RequestMetadata = {}): Promise<AuthTokensResult> {
    const email = normalizeEmail(dto.email);
    const normalizedPassword = normalizePassword(dto.password);

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    // Constant-time mitigation against user enumeration
    if (!user || !user.isActive) {
      // Dummy verification to simulate password verification cost
      await argon2
        .verify(
          "$argon2id$v=19$m=19456,t=2,p=1$c29tZXNhbHQ$5123456789012345678901234567890123456789012",
          normalizedPassword
        )
        .catch(() => false);
      throw new UnauthorizedException("بيانات الاعتماد غير صحيحة (Invalid email or password)");
    }

    const isValid = await argon2.verify(user.passwordHash, normalizedPassword);
    if (!isValid) {
      throw new UnauthorizedException("بيانات الاعتماد غير صحيحة (Invalid email or password)");
    }

    // Create session and opaque refresh token
    const familyId = crypto.randomUUID();
    const rawRefreshToken = this.generateOpaqueToken();
    const tokenHash = this.hashToken(rawRefreshToken);
    const expiresAt = new Date(Date.now() + this.refreshTokenTtlMs);

    const session = await this.prisma.userSession.create({
      data: {
        userId: user.id,
        familyId,
        ipAddress: meta.ip,
        userAgent: meta.userAgent,
        expiresAt,
        refreshTokens: {
          create: {
            userId: user.id,
            tokenHash,
            familyId,
            expiresAt,
          },
        },
      },
    });

    const accessToken = await this.generateAccessToken(
      user.id,
      user.email,
      user.role as UserRole,
      session.id
    );

    return {
      user: this.mapToUserProfileDto(user),
      accessToken,
      rawRefreshToken,
    };
  }

  /**
   * Refreshes access token with Refresh Token Rotation and Reuse Detection
   */
  async refresh(rawRefreshToken: string, meta: RequestMetadata = {}): Promise<AuthTokensResult> {
    if (!rawRefreshToken || typeof rawRefreshToken !== "string") {
      throw new UnauthorizedException("رمز التحديث مفقود (Missing refresh token)");
    }

    const tokenHash = this.hashToken(rawRefreshToken);

    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: {
        user: { include: { profile: true } },
        session: true,
      },
    });

    if (!tokenRecord) {
      throw new UnauthorizedException("رمز التحديث غير صالح (Invalid refresh token)");
    }

    // ===== REUSE DETECTION TRIGGER =====
    if (tokenRecord.isRotated) {
      this.logger.warn(
        `[SECURITY ALERT] Refresh token reuse detected! Family: ${tokenRecord.familyId}, User: ${tokenRecord.userId}`
      );

      // Invalidate the entire family across all sessions
      await this.prisma.$transaction([
        this.prisma.refreshToken.updateMany({
          where: { familyId: tokenRecord.familyId },
          data: { isRevoked: true },
        }),
        this.prisma.userSession.updateMany({
          where: { familyId: tokenRecord.familyId },
          data: { isRevoked: true },
        }),
        this.prisma.systemAuditLog.create({
          data: {
            action: "SECURITY_TOKEN_REUSE_DETECTED",
            actorId: tokenRecord.userId,
            target: `family:${tokenRecord.familyId}`,
            ipAddress: meta.ip,
            details: {
              reason: "Rotated refresh token was presented again",
              userAgent: meta.userAgent,
            },
          },
        }),
      ]);

      throw new UnauthorizedException(
        "تم اكتشاف نشاط غير مصرح به، تم إبطال الجلسة لحماية حسابك (Token reuse detected, session revoked)"
      );
    }

    // Check validity
    if (tokenRecord.isRevoked || tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException(
        "رمز التحديث منتهي الصلاحية أو ملغى (Refresh token expired or revoked)"
      );
    }

    if (tokenRecord.session && tokenRecord.session.isRevoked) {
      throw new UnauthorizedException("جلسة العمل ملغاة (Session has been revoked)");
    }

    if (!tokenRecord.user.isActive) {
      throw new UnauthorizedException("الحساب معطل (Account is inactive)");
    }

    // ===== ATOMIC ROTATION & CONCURRENCY GUARD =====
    const nextRawRefreshToken = this.generateOpaqueToken();
    const nextTokenHash = this.hashToken(nextRawRefreshToken);
    const expiresAt = new Date(Date.now() + this.refreshTokenTtlMs);

    const rotationSucceeded = await this.prisma.$transaction(async (tx) => {
      // 1. Atomically mark current token as rotated ONLY IF it was not already rotated or revoked
      const updateRes = await tx.refreshToken.updateMany({
        where: {
          id: tokenRecord.id,
          isRotated: false,
          isRevoked: false,
        },
        data: { isRotated: true },
      });

      // If count is 0, a concurrent request has already rotated or revoked this token
      if (updateRes.count === 0) {
        // Revoke the entire family due to concurrent replay / race condition
        await tx.refreshToken.updateMany({
          where: { familyId: tokenRecord.familyId },
          data: { isRevoked: true },
        });
        await tx.userSession.updateMany({
          where: { familyId: tokenRecord.familyId },
          data: { isRevoked: true },
        });
        await tx.systemAuditLog.create({
          data: {
            action: "SECURITY_CONCURRENT_ROTATION_REUSE_DETECTED",
            actorId: tokenRecord.userId,
            target: `family:${tokenRecord.familyId}`,
            ipAddress: meta.ip,
            details: {
              reason: "Concurrent rotation race condition or replay attempt detected",
              userAgent: meta.userAgent,
            },
          },
        });
        return false;
      }

      // 2. Issue new opaque refresh token under the same family
      await tx.refreshToken.create({
        data: {
          userId: tokenRecord.userId,
          sessionId: tokenRecord.sessionId,
          familyId: tokenRecord.familyId,
          tokenHash: nextTokenHash,
          expiresAt,
        },
      });

      // 3. Update session activity
      if (tokenRecord.sessionId) {
        await tx.userSession.update({
          where: { id: tokenRecord.sessionId },
          data: {
            lastActiveAt: new Date(),
            ipAddress: meta.ip || tokenRecord.session?.ipAddress,
            userAgent: meta.userAgent || tokenRecord.session?.userAgent,
          },
        });
      }

      return true;
    });

    if (!rotationSucceeded) {
      throw new UnauthorizedException(
        "تم اكتشاف محاولة استخدام متزامنة، تم إبطال الجلسة لأمان حسابك (Concurrent token rotation detected, session revoked)"
      );
    }

    const sessionId = tokenRecord.sessionId || crypto.randomUUID();
    const accessToken = await this.generateAccessToken(
      tokenRecord.user.id,
      tokenRecord.user.email,
      tokenRecord.user.role as UserRole,
      sessionId
    );

    return {
      user: this.mapToUserProfileDto(tokenRecord.user),
      accessToken,
      rawRefreshToken: nextRawRefreshToken,
    };
  }

  /**
   * Checks whether a session exists, is not revoked, and has not expired.
   */
  async isSessionActive(sessionId: string): Promise<boolean> {
    if (!sessionId) return false;
    const session = await this.prisma.userSession.findUnique({
      where: { id: sessionId },
      select: { isRevoked: true, expiresAt: true },
    });
    return Boolean(session && !session.isRevoked && session.expiresAt > new Date());
  }

  /**
   * Logs out the current session by revoking the refresh token and session record
   */
  async logout(rawRefreshToken?: string): Promise<{ success: boolean }> {
    if (!rawRefreshToken) {
      return { success: true };
    }

    if (rawRefreshToken) {
      const tokenHash = this.hashToken(rawRefreshToken);
      const tokenRecord = await this.prisma.refreshToken.findUnique({
        where: { tokenHash },
      });

      if (tokenRecord) {
        await this.prisma.$transaction([
          this.prisma.refreshToken.update({
            where: { id: tokenRecord.id },
            data: { isRevoked: true },
          }),
          ...(tokenRecord.sessionId
            ? [
                this.prisma.userSession.update({
                  where: { id: tokenRecord.sessionId },
                  data: { isRevoked: true },
                }),
              ]
            : []),
        ]);
        return { success: true };
      }
    }

    return { success: true };
  }

  /**
   * Logs out all sessions and devices for a given user
   */
  async logoutAll(userId: string): Promise<{ success: boolean }> {
    await this.prisma.$transaction([
      this.prisma.refreshToken.updateMany({
        where: { userId, isRevoked: false },
        data: { isRevoked: true },
      }),
      this.prisma.userSession.updateMany({
        where: { userId, isRevoked: false },
        data: { isRevoked: true },
      }),
    ]);

    return { success: true };
  }

  /**
   * Retrieves profile details for the authenticated user
   */
  async getMe(userId: string): Promise<UserProfileDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException("المستخدم غير موجود (User not found)");
    }

    return this.mapToUserProfileDto(user);
  }

  /**
   * Updates user profile and preferences
   */
  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserProfileDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException("المستخدم غير موجود (User not found)");
    }

    // Update user fullName if provided
    if (dto.fullName && dto.fullName.trim() !== user.fullName) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { fullName: dto.fullName.trim() },
      });
    }

    // Upsert user profile preferences
    const profile = await this.prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        preferredTheme: dto.preferredTheme || "system",
        fontSize: dto.fontSize ?? 18,
        tashkeelEnabled: dto.tashkeelEnabled ?? true,
        copticScript: dto.copticScript ?? true,
        preferredBibleId: dto.preferredBibleId,
      },
      update: {
        ...(dto.preferredTheme ? { preferredTheme: dto.preferredTheme } : {}),
        ...(dto.fontSize !== undefined ? { fontSize: dto.fontSize } : {}),
        ...(dto.tashkeelEnabled !== undefined ? { tashkeelEnabled: dto.tashkeelEnabled } : {}),
        ...(dto.copticScript !== undefined ? { copticScript: dto.copticScript } : {}),
        ...(dto.preferredBibleId !== undefined ? { preferredBibleId: dto.preferredBibleId } : {}),
      },
    });

    return {
      id: user.id,
      email: user.email,
      fullName: dto.fullName?.trim() || user.fullName,
      role: user.role as UserRole,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt.toISOString(),
      preferences: {
        preferredTheme: profile.preferredTheme,
        fontSize: profile.fontSize,
        tashkeelEnabled: profile.tashkeelEnabled,
        copticScript: profile.copticScript,
        preferredBibleId: profile.preferredBibleId || null,
      },
    };
  }

  /**
   * Lists active sessions for the user
   */
  async getSessions(userId: string, currentSessionId?: string): Promise<UserSessionDto[]> {
    const sessions = await this.prisma.userSession.findMany({
      where: {
        userId,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { lastActiveAt: "desc" },
    });

    return sessions.map((s) => ({
      id: s.id,
      userId: s.userId,
      ipAddress: s.ipAddress || null,
      userAgent: s.userAgent || null,
      createdAt: s.createdAt.toISOString(),
      lastActiveAt: s.lastActiveAt.toISOString(),
      isCurrent: currentSessionId ? s.id === currentSessionId : false,
    }));
  }

  /**
   * Revokes a specific session belonging to the user
   */
  async revokeSession(userId: string, sessionId: string): Promise<{ success: boolean }> {
    const session = await this.prisma.userSession.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new NotFoundException("الجلسة غير موجودة (Session not found)");
    }

    await this.prisma.$transaction([
      this.prisma.userSession.update({
        where: { id: sessionId },
        data: { isRevoked: true },
      }),
      this.prisma.refreshToken.updateMany({
        where: { sessionId },
        data: { isRevoked: true },
      }),
    ]);

    return { success: true };
  }

  /**
   * Generates a signed 15-minute JWT access token
   */
  private async generateAccessToken(
    userId: string,
    email: string,
    role: UserRole,
    sessionId: string
  ): Promise<string> {
    const payload: JwtPayload = {
      sub: userId,
      email,
      role,
      sessionId,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.jwtSecret,
      expiresIn: `${this.accessTokenTtl}s`,
    });
  }

  private mapToUserProfileDto(user: any): UserProfileDto {
    const profile = user.profile;
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role as UserRole,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt.toISOString(),
      preferences: {
        preferredTheme: profile?.preferredTheme || "system",
        fontSize: profile?.fontSize ?? 18,
        tashkeelEnabled: profile?.tashkeelEnabled ?? true,
        copticScript: profile?.copticScript ?? true,
        preferredBibleId: profile?.preferredBibleId || null,
      },
    };
  }
}
