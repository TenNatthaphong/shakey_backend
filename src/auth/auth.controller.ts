  import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { AuthGuard } from './auth.guard';
  import { RegisterDto } from './dto/register.dto';
  import { LoginDto } from './dto/login.dto';
  import { ForgotPasswordDto } from './dto/forgot_password.dto';
  import { ResetPasswordDto } from './dto/reset_password.dto';
  import { ChangePasswordDto } from './dto/change_password.dto';
  import { OtpDto } from './dto/otp.dto';

  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() dto: RegisterDto) {
      //return access_token and user_id,email
      return this.authService.register(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto) {
      return this.authService.login(dto);
    }

    @Post('google')
    async googleLogin(@Body() dto: { code: string; redirectUri: string }) {
      return this.authService.googleLogin(dto.code, dto.redirectUri);
    }

    @UseGuards(AuthGuard)
    @Post('refresh')
    async refresh(@Request() req, @Body('refresh_token') refreshToken: string) {
      const userId = req.user.sub;
      return this.authService.refresh(userId, refreshToken);
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Request() req) {
      const userId = req.user.sub;
      return this.authService.logout(userId);
    }

    @Post('forgot_password')
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
      return this.authService.forgotPassword(dto.email);
    }

    @Post('otp')
    async otpCheck(@Body() dto: OtpDto) {
      return this.authService.otpCheck(dto.email,dto.otp);
    }

    @Post('reset_password')
    async resetPassword(@Body() dto: ResetPasswordDto) {
      return this.authService.resetPassword(dto.reset_token,dto.new_password);
    }

    @UseGuards(AuthGuard)
    @Post('change_password')
    async changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
      const userId = req.user.sub;
      return this.authService.changePassword(userId,dto.old_password,dto.new_password);
    }
  }
