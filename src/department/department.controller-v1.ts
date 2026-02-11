//teleCRM/telecrm-backend/src/department/department.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { TenantL1Guard } from '@/common/guards/tenant-l1.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { AuthUser } from '@/auth/interfaces/auth-user.interface';

import { API_ROUTES } from "@/routes/api.routes";

@Controller('departments')
@UseGuards(JwtAuthGuard, TenantL1Guard)
export class DepartmentController {
  constructor(
    private readonly departmentService: DepartmentService,
  ) {}

  // =====================
  // CREATE DEPARTMENT
  // =====================
  @Post()
  createDepartment(
    @Body() dto: CreateDepartmentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.departmentService.createDepartment({
      name: dto.name,
      organizationId: user.organizationId!,
    });
  }

  // =====================
  // LIST DEPARTMENTS
  // =====================
  @Get()
  listDepartments(@CurrentUser() user: AuthUser) {
    return this.departmentService.listDepartments(
      user.organizationId!,
    );
  }
}
