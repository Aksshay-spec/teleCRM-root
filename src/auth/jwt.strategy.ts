import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthUser } from './interfaces/auth-user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET as string,
    });
  }

  validate(payload: AuthUser): AuthUser {
    return {
      userId: payload.userId,
      accessLevel: payload.accessLevel,
      organizationId: payload.organizationId,
      isSuperAdmin: payload.isSuperAdmin,
    };
  }
}
