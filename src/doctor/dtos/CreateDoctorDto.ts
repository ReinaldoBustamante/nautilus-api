import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator"
import { IsRut } from "src/common/decorators/rut.decorator"

export class CreateDoctorDto {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    phonenumber: string

    @IsNotEmpty()
    @IsString()
    @IsRut()
    rut: string

    @IsNotEmpty()
    @IsUUID()
    specialization_id: string

    @IsNotEmpty()
    @IsUUID()
    user_id: string
}