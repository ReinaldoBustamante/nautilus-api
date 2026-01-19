import { IsOptional, IsPhoneNumber, IsString, IsUUID } from "class-validator"
import { IsRut } from "src/common/decorators/rut.decorator"

export class UpdateDoctorDto {
    @IsOptional()
    @IsString()
    name: string

    @IsOptional()
    @IsPhoneNumber('CL')
    phone_number: string

    @IsOptional()
    @IsRut()
    rut: string

    @IsOptional()
    @IsUUID()
    specialization_id: string

    @IsOptional()
    @IsUUID()
    user_id: string
}