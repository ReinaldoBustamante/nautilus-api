import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator"
import { status_appointment_type } from "prisma/generated/enums"

export class CreateAppointmentDto {
    @IsUUID()
    @IsNotEmpty()
    doctor_id: string

    @IsString()
    @IsNotEmpty()
    patient_name: string

    @IsString()
    @IsNotEmpty()
    patient_rut: string

    @IsString()
    @IsNotEmpty()
    patient_email: string

    @IsUUID()
    @IsNotEmpty()
    service_id: string

    @IsString()
    @IsNotEmpty()
    notes: string

    @IsString()
    @IsNotEmpty()
    address_snapshot: string

    @IsString()
    @IsNotEmpty()
    phone_snapshot: string

    @IsDateString()
    @IsNotEmpty()
    appointment_date: Date

    @IsOptional()
    @IsEnum(status_appointment_type, { message: 'El estado proporcionado no es válido' })
    status: status_appointment_type;

    @IsOptional()
    @IsString()
    doctor_comment: string;

}
