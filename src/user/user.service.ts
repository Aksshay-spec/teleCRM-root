// src/user/user.service.ts

import {
  Inject,
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { USER_REPOSITORY } from './repositories/user-repository.token';
import { UserRepositoryInterface } from './repositories/user.repository.interface';

import { Prisma, Status } from '@prisma/client';
import { PasswordUtil } from '@/common/utils/password.util';

// ======================================================
// 🔒 Allowed access levels for L1-created users
// ======================================================
type L2OrL3AccessLevel = Prisma.UserCreateInput['accessLevel'] & ('L2' | 'L3');

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryInterface,
  ) {}

  // ======================================================
  // 🔒 SIGNUP ONLY (L1 creation)
  // ======================================================
  async createAdminUser(data: {
    email: string;
    password: string;
    designation: string;
    organizationId: string;
  }) {
    if (!data.password) {
      throw new BadRequestException('Password is required');
    }

    const existing = await this.userRepo.findByEmail(
      data.email.toLowerCase(),
    );

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await PasswordUtil.hash(data.password);

    return this.userRepo.create({
      email: data.email.toLowerCase(),
      password: hashedPassword,
      designation: data.designation,
      accessLevel: 'L1',
      status: Status.ACTIVE,
      isSuperAdmin: false,
      organizationId: data.organizationId,
    });
  }

  // ======================================================
  // 🔒 L1 → Creates L2 / L3 users
  // ======================================================
  async createUserByL1(data: {
    email: string;
    password: string;
    designation: string;
    accessLevel: L2OrL3AccessLevel;
    organizationId: string;
    departmentId: string;
  }) {
    if (!data.password) {
      throw new BadRequestException('Password is required');
    }

    if (!data.organizationId) {
      throw new BadRequestException('Organization context missing');
    }

    const existing = await this.userRepo.findByEmail(
      data.email.toLowerCase(),
    );

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await PasswordUtil.hash(data.password);

    return this.userRepo.create({
      email: data.email.toLowerCase(),
      password: hashedPassword,
      designation: data.designation,
      accessLevel: data.accessLevel,
      status: Status.ACTIVE,
      isSuperAdmin: false,
      organizationId: data.organizationId,
      departmentId: data.departmentId,
    });
  }

  // ======================================================
  // 🟢 LIST USERS BY ORGANIZATION
  // ======================================================
  async listUsersByOrganization(organizationId: string) {
    return this.userRepo.findManyByOrganization(organizationId);
  }
}
