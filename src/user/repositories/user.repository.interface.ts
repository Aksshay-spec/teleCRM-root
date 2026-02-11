// src/user/repositories/user.repository.interface.ts

import { User } from '@prisma/client';

export interface UserRepositoryInterface {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findManyByOrganization(organizationId: string): Promise<User[]>;
  create(data: Partial<User>): Promise<User>;
}
