import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TeamModule } from './team/team.module';
import { DepartmentModule } from './department/department.module';

@Module({
  imports: [
    // ✅ THIS LOADS .env FILE
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    TeamModule,
    DepartmentModule,
  ],
})
export class AppModule {}
