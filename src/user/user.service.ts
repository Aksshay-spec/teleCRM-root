import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, Status } from '@prisma/client';
import { PasswordUtil } from '@/common/utils/password.util';

// ======================================================
// 🔒 Allowed access levels for L1-created users
// ======================================================
type L2OrL3AccessLevel =
  Prisma.UserCreateInput['accessLevel'] & ('L2' | 'L3');

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // ======================================================
  // 🔒 SIGNUP ONLY
  // Creates initial L1 user during organization signup
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

    const hashedPassword = await PasswordUtil.hash(data.password);

    return this.prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        password: hashedPassword,
        designation: data.designation,
        accessLevel: 'L1',
        status: Status.ACTIVE,
        isSuperAdmin: false,
        organizationId: data.organizationId,
      },
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

    // 🔐 Ensure department belongs to same organization
    const department = await this.prisma.department.findFirst({
      where: {
        id: data.departmentId,
        organizationId: data.organizationId,
      },
    });

    if (!department) {
      throw new NotFoundException(
        'Department not found in this organization',
      );
    }

    const hashedPassword = await PasswordUtil.hash(data.password);

    try {
      return await this.prisma.user.create({
        data: {
          email: data.email.toLowerCase(),
          password: hashedPassword,
          designation: data.designation,
          accessLevel: data.accessLevel,
          status: Status.ACTIVE,
          isSuperAdmin: false,
          organizationId: data.organizationId,
          departmentId: data.departmentId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email already exists');
      }

      throw error;
    }
  }

  // ======================================================
  // 🟢 LIST USERS BY ORGANIZATION (L1 ONLY)
  // 👉 THIS PART IS INTENTIONALLY ADDED (REQUIRED FOR GET /users)
  // ======================================================
  async listUsersByOrganization(organizationId: string) {
    return this.prisma.user.findMany({
      where: {
        organizationId,
      },
      select: {
        id: true,
        email: true,
        designation: true,
        accessLevel: true,
        departmentId: true,
        teamId: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
