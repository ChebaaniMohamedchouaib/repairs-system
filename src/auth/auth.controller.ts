import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: any) {
    // نرسل الـ username و password لخدمة التحقق
    return this.authService.login(loginDto.username, loginDto.password);
  }
}