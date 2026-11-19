import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { AuthSuccessDto, UserProfileDto, UserSessionDto } from "@ana-orthodox/shared-types";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";

const REFRESH_COOKIE_NAME = "ana_refresh_token";

@ApiTags("Identity & Access Management")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private getIsSecure(): boolean {
    return process.env.NODE_ENV === "production" || process.env.COOKIE_SECURE === "true";
  }

  private validateOrigin(req: Request) {
    const rawOrigin = req.headers?.origin as string | undefined;
    const rawReferer = req.headers?.referer as string | undefined;

    // Explicitly reject null origin (sandboxed iframes, privacy extensions, opaque origins)
    if (rawOrigin === "null") {
      throw new ForbiddenException(
        "طلب غير مصرح به: تم رفض الأصل الفارغ (Null Origin rejected by CSRF policy)"
      );
    }

    const candidate = rawOrigin || rawReferer;
    if (!candidate) return; // Non-browser client or same-origin direct request without Origin header

    const allowed = (process.env.CORS_ORIGINS || "http://localhost:3000")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);

    try {
      const originUrl = new URL(candidate);
      const originHost = originUrl.origin;
      if (!allowed.includes(originHost)) {
        throw new ForbiddenException(
          "طلب غير مصرح به من هذا المصدر (Untrusted Origin rejected by CSRF policy)"
        );
      }
    } catch (e) {
      if (e instanceof ForbiddenException) throw e;
      throw new ForbiddenException(
        "ترويسة الأصل غير صالحة (Malformed Origin or Referer header rejected)"
      );
    }
  }

  private setRefreshTokenCookie(res: Response, rawToken: string) {
    res.cookie(REFRESH_COOKIE_NAME, rawToken, {
      httpOnly: true,
      secure: this.getIsSecure(),
      sameSite: "strict",
      path: "/api/v1/auth",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
  }

  private clearRefreshTokenCookie(res: Response) {
    res.clearCookie(REFRESH_COOKIE_NAME, {
      httpOnly: true,
      secure: this.getIsSecure(),
      sameSite: "strict",
      path: "/api/v1/auth",
    });
  }

  @Post("register")
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Register a new user account" })
  @ApiResponse({
    status: 201,
    description: "User registered and session initialized",
  })
  async register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthSuccessDto> {
    const meta = {
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.headers["user-agent"],
    };

    const result = await this.authService.register(dto, meta);
    this.setRefreshTokenCookie(res, result.rawRefreshToken);

    return {
      accessToken: result.accessToken,
      expiresIn: 900,
      user: result.user,
    };
  }

  @Post("login")
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Authenticate with email and password" })
  @ApiResponse({ status: 200, description: "Authentication successful" })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthSuccessDto> {
    const meta = {
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.headers["user-agent"],
    };

    const result = await this.authService.login(dto, meta);
    this.setRefreshTokenCookie(res, result.rawRefreshToken);

    return {
      accessToken: result.accessToken,
      expiresIn: 900,
      user: result.user,
    };
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Rotate refresh token and issue new 15m access token",
  })
  @ApiResponse({ status: 200, description: "Tokens refreshed" })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthSuccessDto> {
    this.validateOrigin(req);
    const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
    const meta = {
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.headers["user-agent"],
    };

    const result = await this.authService.refresh(rawRefreshToken, meta);
    this.setRefreshTokenCookie(res, result.rawRefreshToken);

    return {
      accessToken: result.accessToken,
      expiresIn: 900,
      user: result.user,
    };
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Terminate current session and clear refresh token cookie",
  })
  @ApiResponse({ status: 200, description: "Logged out" })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ success: boolean }> {
    this.validateOrigin(req);
    const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
    this.clearRefreshTokenCookie(res);

    // Only the opaque refresh cookie establishes the session to revoke.
    // Bearer claims must never be decoded without verification here.
    return this.authService.logout(rawRefreshToken);
  }

  @Post("logout-all")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Revoke all sessions and devices for the authenticated user",
  })
  @ApiResponse({ status: 200, description: "All sessions terminated" })
  async logoutAll(
    @CurrentUser("sub") userId: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ success: boolean }> {
    this.clearRefreshTokenCookie(res);
    return this.authService.logoutAll(userId);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Retrieve authenticated user profile and preferences",
  })
  @ApiResponse({ status: 200, description: "Profile retrieved" })
  async getMe(@CurrentUser("sub") userId: string): Promise<UserProfileDto> {
    return this.authService.getMe(userId);
  }

  @Patch("profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update authenticated user profile and preferences",
  })
  @ApiResponse({ status: 200, description: "Profile updated" })
  async updateProfile(
    @CurrentUser("sub") userId: string,
    @Body() dto: UpdateProfileDto
  ): Promise<UserProfileDto> {
    return this.authService.updateProfile(userId, dto);
  }

  @Get("sessions")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "List active sessions for authenticated user" })
  @ApiResponse({ status: 200, description: "Active sessions list" })
  async getSessions(
    @CurrentUser("sub") userId: string,
    @CurrentUser("sessionId") sessionId: string
  ): Promise<UserSessionDto[]> {
    return this.authService.getSessions(userId, sessionId);
  }

  @Delete("sessions/:sessionId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Revoke a specific active session" })
  @ApiResponse({ status: 200, description: "Session revoked" })
  async revokeSession(
    @CurrentUser("sub") userId: string,
    @Param("sessionId") sessionId: string
  ): Promise<{ success: boolean }> {
    return this.authService.revokeSession(userId, sessionId);
  }
}
