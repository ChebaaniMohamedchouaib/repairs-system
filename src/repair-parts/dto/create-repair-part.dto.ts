export class CreateRepairPartDto {
  name: string;          // اسم القطعة
  costPrice: number;     // سعر الشراء
  invoiceNumber?: string; // رقم الفاتورة (علامة ؟ تعني أنه اختياري)
  repairId: number;      // رقم تذكرة الصيانة
}