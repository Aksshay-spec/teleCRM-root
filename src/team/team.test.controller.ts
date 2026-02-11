import { Controller, Post, Body } from '@nestjs/common';
import { TeamService } from './team.service';

@Controller('test/team')
export class TeamTestController {
  constructor(private readonly teamService: TeamService) {}

  @Post('create')
  create(
    @Body() body: { organizationId: string; name: string; managerId: string },
  ) {
    return this.teamService.createTeam(body);
  }
}
