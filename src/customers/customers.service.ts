import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    try {
      return await this.prisma.customer.create({
        data: {
          name: createCustomerDto.name,
          phone: createCustomerDto.phone,
        },
      });
    } catch (error) {
      // الكود P2002 في بريزما يعني تكرار حقل فريد (Unique)
      if (error.code === 'P2002') {
        throw new ConflictException('رقم الهاتف هذا مسجل لزبون آخر بالفعل');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.customer.findMany({
      include: {
        _count: {
          select: { tickets: true } // جلب عدد الأجهزة التي صلحها الزبون
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: { tickets: true } // جلب سجل الصيانة الخاص بالزبون
    });
    if (!customer) throw new NotFoundException('الزبون غير موجود');
    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    return this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
    });
  }

  async remove(id: string) {
    try {
      return await this.prisma.customer.delete({
        where: { id },
      });
    } catch (error) {
      throw new ConflictException('لا يمكن حذف الزبون لوجود أجهزة صيانة مرتبطة به');
    }
  }
}