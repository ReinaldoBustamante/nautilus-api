import { IsOptional, IsPhoneNumber, IsString, IsUUID } from "class-validator"

export class UpdatePatientDto {
    @IsString()
    @IsOptional()
    name: string

    @IsPhoneNumber('CL')
    @IsOptional()
    phone_number: string

    @IsString()
    @IsOptional()
    default_address: string

    @IsUUID()
    @IsOptional()
    user_id: string
}