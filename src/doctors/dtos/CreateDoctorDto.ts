import { IsNotEmpty, IsPhoneNumber, IsString, IsUUID } from "class-validator"
import { IsRut } from "src/common/decorators/rut.decorator"

export class CreateDoctorDto{

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsPhoneNumber('CL')
    phone_number: string

    @IsNotEmpty()
    @IsRut()
    rut: string

    @IsUUID()
    @IsNotEmpty()
    specialization_id: string
    
    @IsUUID()
    @IsNotEmpty()
    user_id: string
}