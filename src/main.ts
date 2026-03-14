import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // تفعيل استقبال الطلبات من الفرونت اند
  app.enableCors();

  // تفعيل التحقق من البيانات (هذا السطر يحل مشكلة الـ DTO)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // يحذف أي بيانات غير موجودة في الـ DTO
      transform: true, // يحول النصوص إلى أرقام إذا طلبنا ذلك
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.listen(3001); // أو البورت الذي تستخدمه للباك اند (مثلاً 3001)
}
bootstrap();