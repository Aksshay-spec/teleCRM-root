// src/user/repositories/json-user.repository.ts

import { User } from '@prisma/client';
import { randomUUID } from 'crypto';

import { JsonDbUtil } from '@/data/json-db.util';
import { UserRepositoryInterface } from './user.repository.interface';

export class JsonUserRepository implements UserRepositoryInterface {
  private readonly FILE_NAME = 'users.json';

  async findById(id: string): Promise<User | null> {
    const users = JsonDbUtil.read<User[]>(this.FILE_NAME);
    return users.find(u => u.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = JsonDbUtil.read<User[]>(this.FILE_NAME);
    return users.find(u => u.email === email) || null;
  }

  async findManyByOrganization(organizationId: string): Promise<User[]> {
    const users = JsonDbUtil.read<User[]>(this.FILE_NAME);

    return users
      .filter(u => u.organizationId === organizationId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime(),
      );
  }

  async create(data: Partial<User>): Promise<User> {
    const users = JsonDbUtil.read<User[]>(this.FILE_NAME);

    const newUser: User = {
      id: randomUUID(),
      email: data.email!,
      password: data.password!,
      designation: data.designation ?? null,
      accessLevel: data.accessLevel!,
      status: data.status ?? 'ACTIVE',
      isSuperAdmin: data.isSuperAdmin ?? false,
      organizationId: data.organizationId!,
      departmentId: data.departmentId ?? null,
      teamId: data.teamId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(newUser);
    JsonDbUtil.write(this.FILE_NAME, users);

    return newUser;
  }
}
