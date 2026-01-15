import { IsOptional, IsString, IsUUID } from "class-validator"
import { IsRut } from "src/common/decorators/rut.decorator"

export class UpdateDoctorDto {
    
    @IsOptional()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    phonenumber: string

    @IsOptional()
    @IsString()
    @IsRut()
    rut: string

    @IsOptional()
    @IsUUID()
    specialization_id: string

    @IsOptional()
    @IsUUID()
    user_id: string
}