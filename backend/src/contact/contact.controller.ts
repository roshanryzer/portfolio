import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Public } from '../auth/decorators/public.decorator';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class ContactDto {
  @ApiProperty({ example: 'Roshan Shrestha' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'you@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+61 4XXXXXXXX', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty()
  @IsString()
  message: string;
}

@Controller('contact')
export class ContactController {
  constructor(private readonly config: ConfigService) {}

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

  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  async send(@Body() body: ContactDto) {
    const transporter = this.createTransporter();
    const from = this.config.get<string>('SMTP_FROM') || 'no-reply@example.com';
    const to = this.config.get<string>('CONTACT_TO') || this.config.get<string>('SMTP_USER') || from;
    const subjectPrefix = this.config.get<string>('CONTACT_SUBJECT_PREFIX') || '[Portfolio]';

    const subject = `${subjectPrefix} ${body.subject || 'New contact message'}`;
    const phoneLine = body.phone ? `\nPhone: ${body.phone}` : '';
    const text = `From: ${body.name} <${body.email}>${phoneLine}\n\n${body.message}`;
    const html = `<p><strong>From:</strong> ${body.name} &lt;${body.email}&gt;${
      body.phone ? ` · <strong>Phone:</strong> ${body.phone}` : ''
    }</p><p>${body.message.replace(/\n/g, '<br>')}</p>`;

    await transporter.sendMail({
      from,
      replyTo: body.email,
      to,
      subject,
      text,
      html,
    });

    return { ok: true };
  }
}

