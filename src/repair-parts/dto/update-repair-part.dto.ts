import { PartialType } from '@nestjs/mapped-types';
import { CreateRepairPartDto } from './create-repair-part.dto';

export class UpdateRepairPartDto extends PartialType(CreateRepairPartDto) {}
