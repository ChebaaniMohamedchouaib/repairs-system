import { Controller, Patch, Post, Get, Body, Delete, Param } from '@nestjs/common';
import { RepairPartsService } from './repair-parts.service';

@Controller('repair-parts')
export class RepairPartsController {
  constructor(private readonly repairPartsService: RepairPartsService) { }

  @Post()
  create(@Body() body: any) {
    // تمرير البيانات مباشرة كما جاءت من الفرونت-أند
    return this.repairPartsService.create(body);
  }
  @Get()
  findAll() {
    // هو ينادي الخدمة فقط، والخدمة الآن أصبحت تجلب القطع أيضاً!
    return this.repairPartsService.findAll();
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: { costPrice?: number; invoiceNumber?: string }) {
    return this.repairPartsService.update(+id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.repairPartsService.remove(+id);
  }
}