import { IsEnum, IsNotEmpty } from 'class-validator';

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export class UpdateAppointmentStatusDto {
  
  @IsNotEmpty({ message: 'El estado de la cita es obligatorio' })
  @IsEnum(AppointmentStatus, {
    message: 'El estado debe ser: pending, confirmed, cancelled o completed',
  })
  appointment_status: AppointmentStatus;
}