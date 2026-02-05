import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID } from "class-validator"
import { IsRut } from "src/common/decorators/rut.decorator"

export class CreatePatientDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsPhoneNumber('CL')
    @IsNotEmpty()
    default_phone_number: string

    @IsRut()
    @IsNotEmpty()
    rut: string

    @IsString()
    @IsNotEmpty()
    default_address: string

    @IsUUID()
    @IsOptional()
    user_id: string
}