import { SetMetadata } from '@nestjs/common';
import { AccessLevel } from '@prisma/client';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: AccessLevel[]) =>
  SetMetadata(ROLES_KEY, roles);
