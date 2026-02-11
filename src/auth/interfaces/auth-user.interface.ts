import { AccessLevel } from '@prisma/client';

export interface AuthUser {
  userId: string;
  accessLevel: AccessLevel;
  organizationId: string | null;
  isSuperAdmin: boolean;
}
