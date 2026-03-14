import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // تصديره لكي يستخدمه موديول الـ Auth لاحقاً
})
export class UsersModule {}