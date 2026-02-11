// teleCRM/telecrm-backend/src/team/team.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
} from '@nestjs/common';

import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { AddTeamMembersDto } from './dto/add-team-members.dto';

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { TenantL1Guard } from '@/common/guards/tenant-l1.guard';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { AuthUser } from '@/auth/interfaces/auth-user.interface';

import { API_ROUTES } from '@/routes/api.routes';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  // ======================================================
  // 🟢 CREATE TEAM (L1 ONLY)
  // ======================================================
  @Post()
  @UseGuards(JwtAuthGuard, TenantL1Guard)
  async createTeam(
    @Body() dto: CreateTeamDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.teamService.createTeam({
      organizationId: user.organizationId!, // 🔒 always from JWT
      name: dto.name,
      managerId: dto.managerId,
    });
  }

  // ======================================================
  // 🟢 ADD L3 MEMBERS TO TEAM (L2 – TEAM MANAGER ONLY)
  // 👉 THIS ROUTE IS NEW
  // ======================================================
  @Post(':teamId/members')
  @UseGuards(JwtAuthGuard) // 🔒 L2 validated in service
  async addMembersToTeam(
    @Param('teamId') teamId: string,
    @Body() dto: AddTeamMembersDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.teamService.addMembersToTeam({
      teamId,
      managerId: user.userId,
      organizationId: user.organizationId!,
      userIds: dto.userIds,
    });
  }
}
