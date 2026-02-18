// telecrm-backend/src/auth/auth.controller.ts

import { Body, Controller, Post, Get, UseGuards, Req } from "@nestjs/common";
import type { Request } from "express";

import { AuthService } from "./auth.service";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { PrismaService } from "@/prisma/prisma.service";
import { AuthUser } from "./interfaces/auth-user.interface";

import { API_ROUTES } from "@/routes/api.routes";

@Controller(API_ROUTES.AUTH.BASE)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  // =====================
  // POST /auth/signup
  // =====================
  @Post(API_ROUTES.AUTH.SIGNUP)
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  // =====================
  // POST /auth/login
  // =====================
  @Post(API_ROUTES.AUTH.LOGIN)
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  // =====================
  // GET /auth/me
  // =====================
  @UseGuards(JwtAuthGuard)
  @Get(API_ROUTES.AUTH.ME)
  async getMe(@Req() req: Request) {
    const authUser = req.user as AuthUser;

    const user = await this.prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        id: true,
        email: true,
        accessLevel: true,
        isSuperAdmin: true,
      },
    });

    return { user };
  }
}
