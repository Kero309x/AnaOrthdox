import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "@ana-orthodox/shared-types";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new ForbiddenException(
        "ليس لديك الصلاحيات الكافية للقيام بهذا الإجراء (Insufficient permissions)"
      );
    }

    // ADMINISTRATOR has superuser access
    if (user.role === "ADMINISTRATOR") {
      return true;
    }

    const hasRole = requiredRoles.includes(user.role as UserRole);
    if (!hasRole) {
      throw new ForbiddenException(
        "ليس لديك الصلاحيات الكافية للقيام بهذا الإجراء (Insufficient permissions)"
      );
    }

    return true;
  }
}
