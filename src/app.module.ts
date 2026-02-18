import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TeamModule } from './team/team.module';
import { DepartmentModule } from './department/department.module';
import { FormModule } from './form/form.module';
import { LeadModule } from './lead/lead.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    TeamModule,
    DepartmentModule,
    LeadModule,
    FormModule,
  ],
})
export class AppModule {}
