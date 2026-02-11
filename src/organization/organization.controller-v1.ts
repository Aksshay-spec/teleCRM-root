// teleCRM/telecrm-backend/src/organization/organization.controller.ts
import { Controller, Patch, Param, UseGuards } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { PlatformGuard } from '@/common/guards/platform.guard';

import { API_ROUTES } from "@/routes/api.routes";

@Controller('organizations')
@UseGuards(JwtAuthGuard, PlatformGuard)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  // =====================
  // ACTIVATE ORGANIZATION (PLATFORM ONLY)
  // =====================
  @Patch(':id/activate')
  activateOrganization(@Param('id') id: string) {
    return this.organizationService.activateOrganization(id);
  }

  // =====================
  // DEACTIVATE ORGANIZATION (PLATFORM ONLY)
  // =====================
  @Patch(':id/deactivate')
  deactivateOrganization(@Param('id') id: string) {
    return this.organizationService.deactivateOrganization(id);
  }
}