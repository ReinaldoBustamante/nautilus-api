import { IsOptional, IsPhoneNumber, IsString, IsUUID } from "class-validator"

export class UpdateDoctorDto {
    @IsOptional()
    @IsString()
    name: string

    @IsOptional()
    @IsPhoneNumber('CL')
    phone_number: string

    @IsOptional()
    @IsUUID()
    specialization_id: string
}