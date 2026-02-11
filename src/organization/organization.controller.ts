// teleCRM/telecrm-backend/src/organization/organization.controller.ts

import {
  Controller,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';

import { OrganizationService } from './organization.service';

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { PlatformGuard } from '@/common/guards/platform.guard';

import { API_ROUTES } from '@/routes/api.routes';

@Controller(API_ROUTES.ORGANIZATIONS.BASE)
@UseGuards(JwtAuthGuard, PlatformGuard)
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
  ) {}

  // =====================
  // PATCH /organizations/:id/activate
  // =====================
  @Patch(API_ROUTES.ORGANIZATIONS.ACTIVATE)
  activateOrganization(@Param('id') id: string) {
    return this.organizationService.activateOrganization(id);
  }

  // =====================
  // PATCH /organizations/:id/deactivate
  // =====================
  @Patch(API_ROUTES.ORGANIZATIONS.DEACTIVATE)
  deactivateOrganization(@Param('id') id: string) {
    return this.organizationService.deactivateOrganization(id);
  }
}
