// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { USER_REPOSITORY } from './repositories/user-repository.token';
import { JsonUserRepository } from './repositories/json-user.repository';
import { PrismaUserRepository } from './repositories/prisma-user.repository';

@Module({
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useFactory: (prisma: PrismaService) => {
        if (process.env.DATA_SOURCE === 'JSON') {
          return new JsonUserRepository();
        }

        return new PrismaUserRepository(prisma);
      },
      inject: [PrismaService],
    },
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
