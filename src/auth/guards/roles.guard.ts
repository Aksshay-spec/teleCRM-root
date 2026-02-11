import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AccessLevel } from '@prisma/client';
import { AuthUser } from '../interfaces/auth-user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<AccessLevel[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // no role restriction
    }

    const request = context.switchToHttp().getRequest();
    const user: AuthUser = request.user;

    if (!user || !user.accessLevel) {
      throw new ForbiddenException('Access denied');
    }

    if (!requiredRoles.includes(user.accessLevel)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
