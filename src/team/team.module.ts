import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TeamController } from './team.controller';

@Module({
  imports: [PrismaModule],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
