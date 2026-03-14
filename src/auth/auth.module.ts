import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // استيراد موديول المستخدمين

@Module({
  imports: [UsersModule], // ربط موديول المستخدمين لتمكين البحث عنهم
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}