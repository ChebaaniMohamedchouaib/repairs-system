import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RepairsService } from './repairs.service';
import { CreateRepairDto } from './dto/create-repair.dto';
import { RepairStatus } from '@prisma/client'; // 👈 1. أضف هذا الاستيراد في الأعلى

@Controller('repairs')
export class RepairsController {
  constructor(private readonly repairsService: RepairsService) {}

  @Post()
  create(@Body() createRepairDto: CreateRepairDto) {
    return this.repairsService.create(createRepairDto);
  }

  @Get()
  findAll() {
    return this.repairsService.findAll();
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string, 
    @Body('status') status: RepairStatus // 👈 2. غيرنا الكلمة هنا من string إلى RepairStatus
  ) {
    return this.repairsService.updateStatus(+id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.repairsService.remove(+id);
  }
}