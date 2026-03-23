import { ApiProperty } from "@nestjs/swagger"
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator"
import { status_appointment_type } from "prisma/generated/enums"

export class CreateAppointmentDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @IsUUID()
    @IsNotEmpty()
    doctor_id: string

    @ApiProperty({ example: 'Juan Perez' })
    @IsString()
    @IsNotEmpty()
    patient_name: string

    @ApiProperty({ example: '123456789' })
    @IsString()
    @IsNotEmpty()
    patient_rut: string

    @ApiProperty({ example: 'patient@email.cl' })
    @IsString()
    @IsNotEmpty()
    patient_email: string

    @ApiProperty({ example: '689z8400-e29b-41d4-a716-446475440000' })
    @IsUUID()
    @IsNotEmpty()
    service_id: string

    @ApiProperty({ example: 'me duele el oido' })
    @IsString()
    @IsNotEmpty()
    notes: string

    @ApiProperty({ example: 'Calle falsa 123' })
    @IsString()
    @IsNotEmpty()
    address_snapshot: string

    @ApiProperty({ example: '12345678' })
    @IsString()
    @IsNotEmpty()
    phone_snapshot: string

    @ApiProperty({ example: '2026-03-23T18:01:10.000Z' })
    @IsDateString()
    @IsNotEmpty()
    appointment_date: Date

    @ApiProperty({ example: status_appointment_type.PENDING, required: false })
    @IsOptional()
    @IsEnum(status_appointment_type, { message: 'El estado proporcionado no es válido' })
    status: status_appointment_type;

    @ApiProperty({ example: 'al paciente se le limpio el oido', required: false })
    @IsOptional()
    @IsString()
    doctor_comment: string;

}
