import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateDoctorDto } from './create-doctor.dto';



export class UpdateDoctorDto extends PartialType(
  OmitType(CreateDoctorDto, ['name', 'user_id', 'rut'] as const),
) {}