import { Body, Controller, Post, Get, UseGuards, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  // @Post('login')
  // async login(@Body() body: { email: string; password: string }) {
  //   return this.authService.login(body.email, body.password);
  // }

  @Post("login")
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  getMe(@Req() req: Request) {
    return {
      message: "You are authenticated",
      user: req.user,
    };
  }
}
