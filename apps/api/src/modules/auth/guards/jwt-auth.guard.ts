import { resolveJwtSecret } from "../../../config/environment";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { JwtPayload } from "@ana-orthodox/shared-types";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(
        "يجب تسجيل الدخول للوصول إلى هذا المورد (Authentication required)"
      );
    }

    try {
      const secret =
        resolveJwtSecret(this.configService.get<string>("JWT_SECRET"), process.env.NODE_ENV === "production");

      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret,
      });

      // Verify that the associated session is active and not revoked
      if (payload.sessionId) {
        const isActive = await this.authService.isSessionActive(payload.sessionId);
        if (!isActive) {
          throw new UnauthorizedException(
            "جلسة العمل ملغاة أو منتهية الصلاحية (Session has been revoked or expired)"
          );
        }
      }

      // Attach user payload to request
      (request as any).user = payload;
      return true;
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException(
        "جلسة العمل غير صالحة أو منتهية الصلاحية (Invalid or expired access token)"
      );
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;
    const [type, token] = authHeader.split(" ");
    return type === "Bearer" ? token : undefined;
  }
}
