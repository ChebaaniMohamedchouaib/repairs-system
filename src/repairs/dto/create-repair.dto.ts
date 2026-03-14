import { IsString, IsOptional, IsNumber, IsEnum, IsUUID } from 'class-validator';
import { RepairStatus } from '@prisma/client';

export class CreateRepairDto {
  @IsUUID('4', { message: 'رقم الزبون غير صحيح (UUID)' })
  customerId: string;

  @IsOptional()
  @IsUUID('4', { message: 'رقم الفني غير صحيح (UUID)' })
  technicianId?: string; // أضفناه لربط الجهاز بالفني الذي استلمه

  @IsString({ message: 'موديل الجهاز مطلوب' })
  deviceModel: string;

  @IsString({ message: 'رقم الـ IMEI يجب أن يكون نصاً' })
  @IsOptional()
  imei?: string; // حقل جديد

  @IsString({ message: 'كود القفل يجب أن يكون نصاً' })
  @IsOptional()
  passcode?: string; // حقل جديد

  @IsString({ message: 'وصف العطل مطلوب' })
  issueDescription: string;

  @IsNumber({}, { message: 'السعر المتوقع يجب أن يكون رقماً' })
  @IsOptional()
  estimatedPrice?: number;

  @IsNumber({}, { message: 'العربون يجب أن يكون رقماً' })
  @IsOptional()
  deposit?: number; // حقل مالي جديد

  @IsEnum(RepairStatus, { message: 'حالة الجهاز غير صالحة' })
  @IsOptional()
  status?: RepairStatus;
}