import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID } from "class-validator"
import { IsRut } from "src/common/decorators/rut.decorator"

export class RegisterAppointmentDto {
    @IsDateString()
    @IsNotEmpty()
    date: Date

    @IsString()
    @IsNotEmpty()
    address: string

    @IsOptional()
    @IsString()
    comment: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    name: string

    @IsPhoneNumber('CL')
    @IsNotEmpty()
    phone_number: string

    @IsRut()
    @IsNotEmpty()
    rut: string

    @IsUUID()
    @IsNotEmpty()
    doctor_id: string
}