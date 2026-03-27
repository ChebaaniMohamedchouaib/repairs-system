import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsappService } from '../notifications/whatsapp.service';

@Injectable()
export class RepairPartsService {
  constructor(
    private prisma: PrismaService,
    private whatsappService: WhatsappService
  ) { }

  // 1. إضافة قطعة وإرسال واتساب
  // src/repair-parts/repair-parts.service.ts

  // src/repair-parts/repair-parts.service.ts

async create(data: any) {
  // 1. إنشاء القطعة أولاً
  const newPart = await this.prisma.repairPart.create({
    data: {
      name: data.name,
      costPrice: Number(data.costPrice),
      invoiceNumber: data.invoiceNumber,
      repairId: Number(data.repairId),
    },
  });

  // 2. 💡 الأهم: إعادة جلب القطعة مع كل العلاقات لضمان وجود الأسماء
  const partWithDetails = await this.prisma.repairPart.findUnique({
    where: { id: newPart.id },
    include: {
      repair: {
        include: {
          customer: true,
        },
      },
    },
  });

  // 3. إرسال الواتساب باستخدام البيانات الكاملة
  if (partWithDetails) {
    try {
      const customerName = partWithDetails.repair?.customer?.name || 'غير معروف';
      const device = partWithDetails.repair?.deviceModel || 'غير محدد';
      const partName = partWithDetails.name; // 👈 التأكد من أخذ الاسم من الكائن المحفوظ
      const price = partWithDetails.costPrice;

      // الرقم الخاص بك (المدير)
      const myAdminPhone = "213699993395"; 

      const message = 
        `🛒 *تنبيه: شراء قطعة غيار*\n\n` +
        `🛠 *القطعة:* ${partName}\n` +
        `💰 *التكلفة:* ${price} دج\n` +
        `📱 *للجهاز:* ${device}\n` +
        `👤 *الزبون:* ${customerName}\n` +
        `🧾 *الفاتورة:* ${partWithDetails.invoiceNumber || '---'}\n\n` +
        `_تم تسجيل العملية بنجاح_ ✅`;

      await this.whatsappService.sendMessage(myAdminPhone, message);
    } catch (error) {
      console.error('❌ خطأ في تفاصيل رسالة الواتساب:', error);
    }
  }

  return newPart;
}

  // src/repair-parts/repair-parts.service.ts

  async update(id: number, data: { costPrice?: number; invoiceNumber?: string }) {
    try {
      return await this.prisma.repairPart.update({
        where: { id: Number(id) },
        data: {
          // نستخدم التقييد لضمان تحديث الحقول المرسلة فقط
          ...(data.costPrice !== undefined && { costPrice: Number(data.costPrice) }),
          ...(data.invoiceNumber !== undefined && { invoiceNumber: data.invoiceNumber }),
        },
      });
    } catch (error) {
      throw new Error('فشل تحديث بيانات القطعة، تأكد من وجود المعرف الصحيح');
    }
  }

  // 2. رؤية كل القطع التي اشتريتها (سجل المشتريات العام)
  async findAll() {
    return this.prisma.repairPart.findMany({
      include: {
        repair: {
          select: {
            deviceModel: true,
            id: true,
            customer: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' } // الأحدث أولاً
    });
  }

  // حذف قطعة
  async remove(id: number) {
    return this.prisma.repairPart.delete({
      where: { id: Number(id) },
    });
  }
}