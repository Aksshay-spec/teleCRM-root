import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  // =====================
  // CREATE ORGANIZATION (TENANT ONLY)
  // =====================
  async createOrganization(data: {
    name: string;
  }) {
    return this.prisma.organization.create({
      data: {
        name: data.name,
        status: Status.ACTIVE,
      },
    });
  }

  // =====================
  // ACTIVATE ORGANIZATION (PLATFORM)
  // =====================
  async activateOrganization(organizationId: string) {
    return this.prisma.organization.update({
      where: { id: organizationId },
      data: { status: Status.ACTIVE },
    });
  }

  // =====================
  // DEACTIVATE ORGANIZATION (PLATFORM)
  // =====================
  async deactivateOrganization(organizationId: string) {
    return this.prisma.organization.update({
      where: { id: organizationId },
      data: { status: Status.INACTIVE },
    });
  }
}
