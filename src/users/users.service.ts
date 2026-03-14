import { 
  Injectable, 
  ConflictException, 
  NotFoundException, 
  ForbiddenException 
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 1. إنشاء مستخدم جديد (مع تشفير كلمة السر)
  async create(data: any) {
    const existingUser = await this.prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existingUser) {
      throw new ConflictException('اسم المستخدم هذا موجود مسبقاً');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.passwordHash, salt);

    return this.prisma.user.create({
      data: {
        fullName: data.fullName,
        username: data.username,
        passwordHash: hashedPassword,
        role: data.role || 'TECHNICIAN',
      },
    });
  }

  // 2. جلب جميع العمال (بدون الهاش الخاص بكلمة السر للأمان)
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        username: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // 3. حذف عامل (مع حماية حساب المدير العام)
  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('العامل غير موجود');
    }

    // منع حذف حساب الأدمن الأساسي نهائياً
    if (user.username === 'admin') {
      throw new ForbiddenException('لا يمكن حذف حساب المدير العام الأساسي من النظام');
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }

  // 4. تحديث كلمة سر العامل (تصفير كلمة السر من قبل الأدمن)
  async resetPassword(id: string, newPassword: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    return this.prisma.user.update({
      where: { id },
      data: { passwordHash: hashedPassword },
    });
  }
}