import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator"
import { IsRut } from "src/common/decorators/rut.decorator"

export class CreatePatientDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    phonenumber: string

    @IsRut()
    @IsNotEmpty()
    rut: string

    @IsOptional()
    @IsUUID()
    user_id: string
}