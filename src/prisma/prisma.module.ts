import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // هذه الكلمة هي السر!
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // تصدير الخدمة ليراها قسم العملاء
})
export class PrismaModule {}