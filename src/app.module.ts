import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { PrismaModule } from './prisma/prisma.module';
import { RepairsModule } from './repairs/repairs.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,    // موديول قاعدة البيانات أولاً
    UsersModule,     // موديول المستخدمين (الفنيين)
    AuthModule,      // موديول التحقق من الدخول
    CustomersModule, // موديول الزبائن
    RepairsModule,   // موديول تذاكر الصيانة
    NotificationsModule, // موديول الإشعارات
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}