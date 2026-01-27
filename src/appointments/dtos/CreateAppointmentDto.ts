import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator"

export class CreateAppointmentDto {
    @IsNotEmpty()
    @IsDateString()
    appointment_date: string

    @IsNotEmpty()
    @IsString()
    address_snapshot: string

    @IsNotEmpty()
    @IsUUID()
    doctor_id: string

    @IsNotEmpty()
    @IsUUID()
    patient_id: string

    @IsOptional()
    @IsString()
    comment: string
}