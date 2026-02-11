// src/user/repositories/prisma-user.repository.ts

import { PrismaService } from '@/prisma/prisma.service';
import { User } from '@prisma/client';

import { UserRepositoryInterface } from './user.repository.interface';

export class PrismaUserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findManyByOrganization(organizationId: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  create(data: Partial<User>): Promise<User> {
    return this.prisma.user.create({ data });
  }
}
