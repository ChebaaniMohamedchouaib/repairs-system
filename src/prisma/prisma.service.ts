import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

// شحن ملف الـ .env يدوياً للتأكد من قراءته
dotenv.config();

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // جلب الرابط والتأكد أنه ليس فارغاً
    const url = process.env.DATABASE_URL;
    
    if (!url) {
      throw new Error('❌ DATABASE_URL is not defined in .env file');
    }

    const pool = new Pool({ connectionString: url });
    const adapter = new PrismaPg(pool as any);
    
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ تم الاتصال بنجاح! قاعدة البيانات جاهزة الآن.');
    } catch (error) {
      console.error('❌ فشل الاتصال بقاعدة البيانات، تأكد من تشغيل PostgreSQL وكلمة المرور.');
      console.error(error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}