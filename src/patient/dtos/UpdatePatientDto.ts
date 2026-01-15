import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator"
import { IsRut } from "src/common/decorators/rut.decorator"

export class UpdatePatientDto {
    @IsOptional()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    phonenumber: string

    @IsOptional()
    @IsRut()
    rut: string

    @IsOptional()
    @IsUUID()
    user_id: string
}