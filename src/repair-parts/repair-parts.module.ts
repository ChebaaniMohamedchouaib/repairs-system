import { Module } from '@nestjs/common';
import { RepairPartsService } from './repair-parts.service';
import { RepairPartsController } from './repair-parts.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [RepairPartsController],
  providers: [RepairPartsService, PrismaService], // تأكد من وجود PrismaService هنا
})
export class RepairPartsModule {}
