import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    const secret =
      config.get('JWT_REFRESH_SECRET') ??
      (process.env.NODE_ENV === 'production' ? undefined : 'dev-jwt-refresh-secret-min-32-chars');
    if (!secret) throw new Error('JWT_REFRESH_SECRET must be set in environment');
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }

  async validate(_req: Request, payload: { sub: string }) {
    return { userId: payload.sub };
  }
}
