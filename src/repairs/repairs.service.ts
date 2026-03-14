import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsappService } from '../notifications/whatsapp.service';
import { CreateRepairDto } from './dto/create-repair.dto';
import { RepairStatus } from '@prisma/client'; // تم الاستيراد بنجاح

@Injectable()
export class RepairsService {
  constructor(
    private prisma: PrismaService,
    private whatsappService: WhatsappService 
  ) { }

  async create(createRepairDto: CreateRepairDto) {
  const { customerId, technicianId, ...repairData } = createRepairDto;

  const customerExists = await this.prisma.customer.findUnique({
    where: { id: customerId },
  });

  if (!customerExists) {
    throw new BadRequestException('الزبون غير موجود في قاعدة البيانات');
  }

  // 1. إنشاء التذكرة في قاعدة البيانات
  const repair = await this.prisma.repairTicket.create({
    data: {
      deviceModel: repairData.deviceModel,
      imei: repairData.imei,
      passcode: repairData.passcode,
      issueDescription: repairData.issueDescription,
      estimatedPrice: repairData.estimatedPrice,
      deposit: repairData.deposit || 0,
      status: repairData.status || RepairStatus.PENDING,
      customer: { connect: { id: customerId } },
      ...(technicianId && { technician: { connect: { id: technicianId } } }),
    },
    include: {
      customer: true,
      technician: { select: { fullName: true, username: true } }
    },
  });

  // 2. إرسال رسالة ترحيب وتأكيد استلام عبر الواتساب
  try {
    const welcomeMessage = 
      `مرحباً سيد ${repair.customer.name}،\n\n` +
      `تم استلام جهازكم (${repair.deviceModel}) بنجاح في Houba Phone. 📱\n` +
      `رقم التذكرة: #${repair.id}\n` +
      `المبلغ المتفق عليه: ${repair.estimatedPrice} دج\n` +
      `العربون: ${repair.deposit} دج\n\n` +
      `سنقوم بإعلامكم فور جاهزية الجهاز. شكراً لثقتكم! ✨`;

    await this.whatsappService.sendMessage(repair.customer.phone, welcomeMessage);
    console.log(`تم إرسال رسالة استقبال للزبون: ${repair.customer.name}`);
  } catch (error) {
    // نكتفي بتسجيل الخطأ في السجل (Log) لكي لا يتوقف عمل النظام إذا فشل الواتساب
    console.error('فشل إرسال رسالة الترحيب، لكن التذكرة حُفظت بنجاح.');
  }

  return repair;
}

  async findAll() {
    return this.prisma.repairTicket.findMany({
      include: {
        customer: true,
        technician: { select: { fullName: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // التعديل هنا: تغيير string إلى RepairStatus
  async updateStatus(id: number, newStatus: RepairStatus) { 
    try {
      const repair = await this.prisma.repairTicket.update({
        where: { id: Number(id) },
        data: { status: newStatus }, // الآن النوع متطابق تماماً
        include: { customer: true }
      });

      if (newStatus === RepairStatus.READY) { // استخدام الـ Enum للمقارنة أيضاً
        const message = `مرحباً سيد ${repair.customer.name}،\n\nنحيطكم علماً بأن جهازكم (${repair.deviceModel}) قد تمت صيانته بنجاح وهو جاهز للاستلام الآن. ✅\n\nشكراً لثقتكم بمحل Houba Phone!`;
        
        try {
          await this.whatsappService.sendMessage(repair.customer.phone, message);
          console.log(`تم إرسال إشعار النجاح للزبون: ${repair.customer.name}`);
        } catch (error) {
          console.error('فشل إرسال رسالة الواتساب:', error);
        }
      }

      return repair;
    } catch (error) {
      throw new NotFoundException('تذكرة الصيانة غير موجودة');
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.repairTicket.delete({
        where: { id: Number(id) },
      });
    } catch (error) {
      throw new BadRequestException('فشل الحذف، قد تكون التذكرة مرتبطة ببيانات أخرى');
    }
  }
}