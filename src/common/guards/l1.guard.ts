import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthUser } from '@/auth/interfaces/auth-user.interface';
import { AccessLevel } from '@prisma/client';

@Injectable()
export class L1Guard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthUser | undefined;

    if (!user) {
      throw new ForbiddenException('Unauthenticated request');
    }

    if (user.isSuperAdmin) {
      return true;
    }

    if (user.accessLevel === AccessLevel.L1) {
      return true;
    }

    throw new ForbiddenException('Only L1 users can access this resource');
  }
}
