import { IsString, MinLength, Matches } from 'class-validator';

export class CreateCustomerDto {
  @IsString({ message: 'الاسم يجب أن يكون نصاً' })
  @MinLength(3, { message: 'اسم الزبون قصير جداً' })
  name: string;

  @IsString({ message: 'رقم الهاتف مطلوب' })
  @Matches(/^[0-9]+$/, { message: 'رقم الهاتف يجب أن يحتوي على أرقام فقط' })
  phone: string;
}