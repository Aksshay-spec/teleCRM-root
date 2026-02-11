// telecrm-backend/src/auth/auth.controller.ts
import { Body, Controller, Post, Get, UseGuards, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { PrismaService } from "@/prisma/prisma.service";
import { Request } from "express";
import { AuthUser } from "./interfaces/auth-user.interface";
import { API_ROUTES } from '@/routes/api.routes';

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Post("signup")
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post("login")
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  // ✅ FIXED
  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getMe(@Req() req: Request) {
    console.log("🔥 /auth/me HIT");
    const authUser = req.user as AuthUser;
    console.log("🔥 authUser:", authUser);

    const user = await this.prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        id: true,
        email: true,
        accessLevel: true,
        isSuperAdmin: true,
      },
    });
    console.log("🔥 DB user:", user);
    return {
      user,
    };
  }
}
