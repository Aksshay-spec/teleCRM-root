//src/form/form.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateFormDto } from './dto/create-form.dto';
import { AddFieldDto } from './dto/add-field.dto';

@Injectable()
export class FormService {
  constructor(private prisma: PrismaService) {}

  async createForm(dto: CreateFormDto, organizationId: string) {
    // Check if active form already exists
    const existingActive = await this.prisma.formDefinition.findFirst({
      where: {
        organizationId,
        processType: dto.processType,
        isActive: true,
      },
    });

    return this.prisma.formDefinition.create({
      data: {
        ...dto,
        organizationId,
        isActive: existingActive ? false : true,
      },
    });
  }

  async addField(formId: string, dto: AddFieldDto, organizationId: string) {
    const form = await this.prisma.formDefinition.findFirst({
      where: { id: formId, organizationId },
    });

    if (!form) {
      throw new NotFoundException('Form not found');
    }

    // Ensure unique key per form
    const existingKey = await this.prisma.formFieldDefinition.findFirst({
      where: { formDefinitionId: formId, key: dto.key },
    });

    if (existingKey) {
      throw new BadRequestException('Field key already exists');
    }

    // Validate dropdown options
    if (dto.type === 'DROPDOWN' && (!dto.options || dto.options.length === 0)) {
      throw new BadRequestException('Dropdown must have options');
    }

    if (dto.type !== 'DROPDOWN' && dto.options) {
      throw new BadRequestException('Only dropdown can have options');
    }

    return this.prisma.formFieldDefinition.create({
      data: {
        ...dto,
        formDefinitionId: formId,
        organizationId,
      },
    });
  }

  async activateForm(formId: string, organizationId: string) {
    const form = await this.prisma.formDefinition.findFirst({
      where: { id: formId, organizationId },
    });

    if (!form) {
      throw new NotFoundException('Form not found');
    }

    return this.prisma.$transaction([
      this.prisma.formDefinition.updateMany({
        where: {
          organizationId,
          processType: form.processType,
        },
        data: { isActive: false },
      }),
      this.prisma.formDefinition.update({
        where: { id: formId },
        data: { isActive: true },
      }),
    ]);
  }

  async getActiveForm(processType: string, organizationId: string) {
    return this.prisma.formDefinition.findFirst({
      where: {
        organizationId,
        processType: processType as any,
        isActive: true,
      },
      include: {
        fields: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }
}
