import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TeamModule } from './team/team.module';
import { DepartmentModule } from './department/department.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    TeamModule,
    DepartmentModule,
  ],
})
export class AppModule {}
