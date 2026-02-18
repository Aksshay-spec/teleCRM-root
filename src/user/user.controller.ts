// teleCRM/telecrm-backend/src/user/user.controller.ts

import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import type { Request } from 'express';

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { L1Guard } from '@/common/guards/l1.guard';
import { TenantL1Guard } from '@/common/guards/tenant-l1.guard';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

import { API_ROUTES } from '@/routes/api.routes';

interface AuthUser {
  userId: string;
  accessLevel: 'L1' | 'L2' | 'L3';
  organizationId: string | null;
  isSuperAdmin: boolean;
}

@Controller(API_ROUTES.USERS.BASE)
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  // ======================================================
  // 🟢 CREATE USER (L1 → creates L2 / L3)
  // POST /users/create
  // ======================================================
  @Post(API_ROUTES.USERS.CREATE)
  @UseGuards(JwtAuthGuard, L1Guard)
  async createUser(
    @Req() req: Request,
    @Body() dto: CreateUserDto,
  ) {
    const loggedInUser = req.user as AuthUser;

    if (!loggedInUser.organizationId) {
      throw new BadRequestException(
        'Organization context missing',
      );
    }

    return this.userService.createUserByL1({
      email: dto.email,
      password: dto.password,
      designation: dto.designation,
      accessLevel: dto.accessLevel, // 'L2' | 'L3'
      organizationId: loggedInUser.organizationId,
      departmentId: dto.departmentId,
    });
  }

  // ======================================================
  // 🟢 LIST USERS (L1 ONLY – TENANT SAFE)
  // GET /users
  // ======================================================
  @Get(API_ROUTES.USERS.LIST)
  @UseGuards(JwtAuthGuard, TenantL1Guard)
  async listUsers(
    @Req() req: Request,
  ) {
    const loggedInUser = req.user as AuthUser;

    if (!loggedInUser.organizationId) {
      throw new BadRequestException(
        'Organization context missing',
      );
    }

    return this.userService.listUsersByOrganization(
      loggedInUser.organizationId,
    );
  }
}
