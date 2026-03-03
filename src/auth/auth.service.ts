import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { OAuth2Client } from 'google-auth-library';
import { LoginDto } from './dto/login.dto';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly mailerService: MailerService,
  ) { }

  //generate jwt token
  async getTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const [at, rt] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1d',
      }),
      this.jwt.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '30d',
      }),
    ]);

    return { access_token: at, refresh_token: rt };
  }

  //update refresh token hash
  async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hash = await crypto.createHash('sha256').update(refreshToken).digest('hex');
    await this.prisma.userAuth.update({
      where: { user_id: userId },
      data: { hashedRefreshToken: hash },
    });
  }

  private googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
  );

  //google register/login
  async googleLogin(idToken: string) {
    const ticket = await this.googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      throw new UnauthorizedException('Invalid Google token');
    }
    const { email, sub } = payload;

    let user = await this.prisma.user.findUnique({
      where: { email },
      include: { user_auth: true },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          user_auth: {
            create: {
              provider: 'GOOGLE',
              provider_user_id: sub,
            },
          },
        },
        include: { user_auth: true },
      });
    }

    const tokens = await this.getTokens(user.user_id, user.email);
    await this.updateRefreshTokenHash(user.user_id, tokens.refresh_token);

    return {
      ...tokens,
      user: {
        user_id: user.user_id,
        email: user.email,
      },
    };
  }

  //Local Register
  async register(dto: RegisterDto) {
    const { email, password, firstname, lastname, phone } = dto;

    const existing = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      throw new BadRequestException('อีเมลนี้ถูกใช้งานแล้ว');
    }

    const hashed = await crypto.createHash('sha256').update(password).digest('hex');

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, firstname, lastname, phone },
      });

      await tx.userAuth.create({
        data: {
          user_id: user.user_id,
          provider: 'LOCAL',
          password_hash: hashed,
        },
      });

      return user;
    });
    const tokens = await this.getTokens(result.user_id, result.email);
    await this.updateRefreshTokenHash(result.user_id, tokens.refresh_token);
    return {
      ...tokens,
      user: {
        user_id: result.user_id,
        email: result.email,
      },
    };
  }

  //Local Login
  async login(dto: LoginDto) {
    const { email, password } = dto;

    //find user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    //find user auth by user_id
    const auth = await this.prisma.userAuth.findUnique({
      where: { user_id: user.user_id },
    });

    if (!auth) {
      throw new BadRequestException('User not found');
    }

    //compare password
    const valid = await crypto.createHash('sha256').update(password).digest('hex') === auth.password_hash;

    if (!valid) {
      throw new BadRequestException('Invalid password');
    }

    const tokens = await this.getTokens(user.user_id, user.email);
    await this.updateRefreshTokenHash(user.user_id, tokens.refresh_token);
    return {
      ...tokens,
      user: {
        user_id: user.user_id,
        email: user.email,
      },
    };
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { user_id: userId },
      include: { user_auth: true },
    });

    if (!user || !user.user_auth?.hashedRefreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const rtMatches = await crypto.createHash('sha256').update(refreshToken).digest('hex') === user.user_auth.hashedRefreshToken;

    if (!rtMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.getTokens(user.user_id, user.email);
    await this.updateRefreshTokenHash(user.user_id, tokens.refresh_token);
    return {
      ...tokens,
      user: {
        user_id: user.user_id,
        email: user.email,
      },
    };
  }

  async logout(userId: string) {
    await this.prisma.userAuth.updateMany({
      where: {
        user_id: userId,
        hashedRefreshToken: { not: null },
      },
      data: { hashedRefreshToken: null },
    });
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const token = await this.jwt.signAsync({ sub: user.user_id }, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    const expireAt = new Date(Date.now() + 15 * 60 * 1000);
    const hash = await crypto.createHash('sha256').update(otp).digest('hex');
    await this.prisma.userAuth.update({
      where: { user_id: user.user_id },
      data: { otp_hash: hash, otp_expiry: expireAt },
    });

    // Send email asynchronously to don't block the response
    this.mailerService.sendMail({
      to: email,
      subject: 'Forgot Password',
      text: `This task created for test Shakey app only\nYour OTP is: ${otp}`,
    }).catch(err => {
      this.logger.error('Failed to send forgot password email:', err);
    });

    return { otp };
  }

  async otpCheck(email: string, otp: string) {

    const user = await this.prisma.user.findUnique({
      where: { email: email },
      include: { user_auth: true },
    });

    if (!user || !user.user_auth) {
      throw new BadRequestException('User not found');
    }

    if (
      !user.user_auth.otp_hash ||
      !user.user_auth.otp_expiry ||
      new Date() > user.user_auth.otp_expiry
    ) {
      throw new BadRequestException('OTP expired');
    }

    const isMatch = await crypto.createHash('sha256').update(otp).digest('hex') === user.user_auth.otp_hash;

    if (!isMatch) {
      throw new BadRequestException('Invalid OTP');
    }

    const resetToken = crypto.randomUUID();
    const hashResetToken = await crypto.createHash('sha256').update(resetToken).digest('hex');
    const expireAt = new Date(Date.now() + 10 * 60 * 1000);
    //update otp hash
    await this.prisma.userAuth.update({
      where: { user_id: user.user_id },
      data: {
        otp_hash: null,
        otp_expiry: null,
        reset_token_hash: hashResetToken,
        reset_token_expiry: expireAt,
      },
    });
    return { resetToken };
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {

    const auth = await this.prisma.userAuth.findUnique({
      where: { user_id: userId },
    });

    const isMatch = await crypto.createHash('sha256').update(oldPassword).digest('hex') === auth?.password_hash;

    if (!isMatch) {
      throw new BadRequestException('Invalid password');
    }

    await this.updatePassword(userId, newPassword);

    return { message: 'Password changed successfully' };
  }

  async resetPassword(resetToken: string, newPassword: string) {

    const hashResetToken = await crypto.createHash('sha256').update(resetToken).digest('hex');
    const auth = await this.prisma.userAuth.findFirst({
      where: {
        reset_token_hash: hashResetToken,
        reset_token_expiry: { gte: new Date() },
      },
    });

    if (!auth) {
      throw new BadRequestException('Invalid or expired token');
    }

    await this.updatePassword(auth.user_id, newPassword);

    return { message: 'Password reset successful' };
  }

  private async updatePassword(userId: string, newPassword: string) {
    const hashed = await crypto.createHash('sha256').update(newPassword).digest('hex');

    await this.prisma.userAuth.update({
      where: { user_id: userId },
      data: {
        password_hash: hashed,
        reset_token_hash: null,
        reset_token_expiry: null,
        hashedRefreshToken: null,
      },
    });
  }
}
