import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(username: string, pass: string) {
    // 1. البحث عن المستخدم في قاعدة البيانات
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    // 2. إذا لم نجد المستخدم
    if (!user) {
      throw new UnauthorizedException('اسم المستخدم غير موجود');
    }

    // 3. مقارنة كلمة السر المدخلة مع الهاش المشفر في القاعدة
    const isMatch = await bcrypt.compare(pass, user.passwordHash);

    if (!isMatch) {
      throw new UnauthorizedException('كلمة السر خاطئة');
    }

    // 4. إرجاع بيانات المستخدم (بدون الباسورد) لكي يخزنها الفرونت اند
    const { passwordHash, ...result } = user;
    return result;
  }
}