import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator"

export class CreateServiceDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsNotEmpty()
    @IsNumber()
    price: number

    @IsString()
    @IsUUID()
    @IsNotEmpty()
    specialization_id: string
}