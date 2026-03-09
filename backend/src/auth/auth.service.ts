import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomBytes, createHash } from 'crypto';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private users: UsersService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashed,
        name: dto.name,
      },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    const tokens = await this.issueTokens(user.id, user.email);
    return { user, ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.issueTokens(user.id, user.email);
    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      ...tokens,
    };
  }

  async refreshTokens(refreshToken: string) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });
    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    await this.prisma.refreshToken.delete({ where: { id: stored.id } });
    return this.issueTokens(stored.user.id, stored.user.email);
  }

  private hashResetToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private createTransporter() {
    const host = this.config.get<string>('SMTP_HOST');
    const port = Number(this.config.get<string>('SMTP_PORT') || 587);
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASS');
    const secure = this.config.get<string>('SMTP_SECURE') === 'true';

    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined,
    });
  }

  private async issueTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const accessToken = this.jwt.sign(payload, {
      expiresIn: this.config.get('JWT_EXPIRES_IN', '15m'),
    });
    const refreshSecret =
      this.config.get('JWT_REFRESH_SECRET') ??
      (process.env.NODE_ENV === 'production' ? undefined : 'dev-jwt-refresh-secret-min-32-chars');
    if (!refreshSecret) throw new Error('JWT_REFRESH_SECRET must be set in environment');
    const refreshToken = this.jwt.sign(
      { sub: userId, type: 'refresh' },
      { secret: refreshSecret, expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d') },
    );
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
    };
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Do not reveal whether user exists
      return { ok: true };
    }
    const token = randomBytes(32).toString('hex');
    const hashed = this.hashResetToken(token);
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: hashed,
        passwordResetExpires: expires,
      },
    });

    // Build reset URL pointing to frontend
    const frontendBase = this.config.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    const resetUrl = `${frontendBase.replace(/\/$/, '')}/reset-password?token=${token}`;

    // Send email via SMTP (best-effort: log but do not fail the API if sending fails)
    try {
      const transporter = this.createTransporter();
      const from = this.config.get<string>('SMTP_FROM') || 'no-reply@example.com';
      await transporter.sendMail({
        from,
        to: user.email,
        subject: 'Reset your password',
        text: `You requested a password reset.\n\nUse the link below to set a new password:\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
        html: `<p>You requested a password reset.</p>
               <p><a href="${resetUrl}">Click here to reset your password</a></p>
               <p>If you did not request this, you can ignore this email.</p>`,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to send reset email', err);
    }

    // For development, still return the raw token so you can test without email
    return { ok: true, resetToken: token };
  }

  async resetPassword(token: string, password: string) {
    const hashed = this.hashResetToken(token);
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: hashed,
        passwordResetExpires: { gt: new Date() },
      },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });
    await this.prisma.refreshToken.deleteMany({ where: { userId: user.id } });
    return { ok: true };
  }
}
