import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AccessLevel } from '@prisma/client';

@Injectable()
export class TenantL1Guard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Unauthenticated request');
    }

    // ❌ Platform admin not allowed in tenant APIs
    if (user.isSuperAdmin) {
      throw new ForbiddenException('Platform admin cannot access tenant APIs');
    }

    // ✅ Only L1 allowed
    if (user.accessLevel !== AccessLevel.L1) {
      throw new ForbiddenException('Only L1 users can perform this action');
    }

    return true;
  }
}
