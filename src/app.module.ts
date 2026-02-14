import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TeamModule } from './team/team.module';
import { DepartmentModule } from './department/department.module';
import { FormModule } from './form/form.module';

@Module({
  imports: [PrismaModule, AuthModule, TeamModule, DepartmentModule, FormModule],
})
export class AppModule {}
