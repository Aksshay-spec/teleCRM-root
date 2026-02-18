//src/lead/lead.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { ApproveLeadDto } from './dto/approve-lead.dto';
import { ApprovalStatus, ProcessType } from '@prisma/client';

@Injectable()
export class LeadService {
  constructor(private prisma: PrismaService) {}

  // 🔥 Create Lead with dynamic validation
  // async createLead(dto: CreateLeadDto, user: any) {
  //   const { organizationId, id: userId, accessLevel } = user;

  //   // 1️⃣ Fetch active LEAD form
  //   const form = await this.prisma.formDefinition.findFirst({
  //     where: {
  //       organizationId,
  //       processType: ProcessType.LEAD,
  //       isActive: true,
  //     },
  //     include: {
  //       fields: true,
  //     },
  //   });

  //   if (!form) {
  //     throw new BadRequestException('No active LEAD form found');
  //   }

  //   // 2️⃣ Validate dynamic fields
  //   const submittedData = dto.data || {};
  //   for (const field of form.fields) {
  //     const value = submittedData[field.key];

  //     if (field.required && (value === undefined || value === null)) {
  //       throw new BadRequestException(
  //         `Field "${field.label}" is required`,
  //       );
  //     }

  //     if (value !== undefined && value !== null) {
  //       this.validateFieldType(field.type, value, field.options);
  //     }
  //   }

  //   // 3️⃣ Create Lead
  //   return this.prisma.lead.create({
  //     data: {
  //       name: dto.name,
  //       phone: dto.phone,
  //       data: submittedData,
  //       organizationId,
  //       createdByUserId: userId,
  //       createdByRole: accessLevel,
  //       approvalStatus: ApprovalStatus.PENDING,
  //     },
  //   });
  // }

  async createLead(dto: CreateLeadDto, user: any) {
    const userId = user.userId; // 🔥 FIXED
    const organizationId = user.organizationId;
    const accessLevel = user.accessLevel;

    if (!organizationId) {
      throw new BadRequestException('User not assigned to organization');
    }

    if (!userId) {
      throw new BadRequestException('Invalid user context');
    }

    return this.prisma.lead.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        data: dto.data || {},
        createdByRole: accessLevel,
        approvalStatus: ApprovalStatus.PENDING,

        // 🔥 relational style (correct Prisma way)
        organization: {
          connect: { id: organizationId },
        },

        createdByUser: {
          connect: { id: userId },
        },
      },
    });
  }

  // 🔥 Field Type Validator
  private validateFieldType(type: string, value: any, options: any) {
    switch (type) {
      case 'TEXT':
        if (typeof value !== 'string') {
          throw new BadRequestException('Invalid TEXT value');
        }
        break;

      case 'NUMBER':
        if (typeof value !== 'number') {
          throw new BadRequestException('Invalid NUMBER value');
        }
        break;

      case 'BOOLEAN':
        if (typeof value !== 'boolean') {
          throw new BadRequestException('Invalid BOOLEAN value');
        }
        break;

      case 'DATE':
        if (isNaN(Date.parse(value))) {
          throw new BadRequestException('Invalid DATE value');
        }
        break;

      case 'DROPDOWN':
        if (!options || !options.includes(value)) {
          throw new BadRequestException('Invalid DROPDOWN option');
        }
        break;
    }
  }

  // 🔥 List Leads (Tenant Scoped)
  async listLeads(organizationId: string, status?: ApprovalStatus) {
    return this.prisma.lead.findMany({
      where: {
        organizationId,
        ...(status && { approvalStatus: status }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 🔥 Approve / Reject Lead
  async approveLead(leadId: string, dto: ApproveLeadDto, user: any) {
    const lead = await this.prisma.lead.findFirst({
      where: {
        id: leadId,
        organizationId: user.organizationId,
      },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    if (lead.approvalStatus !== ApprovalStatus.PENDING) {
      throw new BadRequestException('Lead already processed');
    }

    return this.prisma.lead.update({
      where: { id: leadId },
      data: {
        approvalStatus: dto.status,
        approvedByUserId: user.id,
        approvedAt: new Date(),
        rejectionReason:
          dto.status === ApprovalStatus.REJECTED ? dto.rejectionReason : null,
      },
    });
  }
}
