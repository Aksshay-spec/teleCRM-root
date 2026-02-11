import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

import { SignupDto } from './dto/signup.dto';
import { OrganizationService } from '@/organization/organization.service';
import { UserService } from '@/user/user.service';
import { PrismaService } from '@/prisma/prisma.service';
import { PasswordUtil } from '@/common/utils/password.util';
import { JwtService } from '@nestjs/jwt';
import { Status } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // =====================
  // SIGNUP (PUBLIC: ORG + L1)
  // =====================
  async signup(dto: SignupDto) {
    // ✅ Create tenant organization (NO email/password here)
    const organization = await this.organizationService.createOrganization({
      name: dto.organizationName,
    });

    // ✅ Create L1 admin user for tenant
    const adminUser = await this.userService.createAdminUser({
      email: dto.adminEmail,
      password: dto.adminPassword,
      designation: dto.adminDesignation,
      organizationId: organization.id,
    });

    return {
      message: 'Organization and admin user created successfully',
      organizationId: organization.id,
      adminUserId: adminUser.id,
    };
  }

  // =====================
  // LOGIN (PLATFORM + TENANT SAFE)
  // =====================
  async login(email: string, password: string) {
    // 🔑 Fetch ONLY user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 🔑 Validate password
    const isValid = await PasswordUtil.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 🏗️ PLATFORM ADMIN (Super Admin)
    if (user.isSuperAdmin) {
      return this.signToken(user);
    }

    // 🏢 TENANT USER VALIDATION
    if (!user.organizationId) {
      throw new ForbiddenException('User is not linked to an organization');
    }

    const organization = await this.prisma.organization.findUnique({
      where: { id: user.organizationId },
    });

    if (user.status !== Status.ACTIVE) {
      throw new ForbiddenException('User account is inactive');
    }

    if (!organization || organization.status !== Status.ACTIVE) {
      throw new ForbiddenException('Organization is inactive');
    }

    return this.signToken(user);
  }

  // =====================
  // TOKEN HELPER
  // =====================
  private signToken(user: any) {
    const payload = {
      userId: user.id,
      accessLevel: user.accessLevel,
      organizationId: user.organizationId,
      isSuperAdmin: user.isSuperAdmin,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      accessLevel: user.accessLevel,
      isSuperAdmin: user.isSuperAdmin,
    };
  }
}
