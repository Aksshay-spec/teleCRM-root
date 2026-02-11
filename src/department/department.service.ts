import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}

  // =====================
  // CREATE DEPARTMENT (L1)
  // =====================
  async createDepartment(input: {
    name: string;
    organizationId: string;
  }) {
    const { name, organizationId } = input;

    // prevent duplicate department names per org
    const existing = await this.prisma.department.findFirst({
      where: {
        name: name.toLowerCase(),
        organizationId,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Department with this name already exists',
      );
    }

    return this.prisma.department.create({
      data: {
        name: name.toLowerCase(),
        organizationId,
      },
    });
  }

  // =====================
  // LIST DEPARTMENTS (ORG)
  // =====================
  async listDepartments(organizationId: string) {
    return this.prisma.department.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
