import { PickType } from '@nestjs/swagger'
import { CreateAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends PickType(
  CreateAppointmentDto,
  ['status', 'doctor_comment'] as const,
) {}