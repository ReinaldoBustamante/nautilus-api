import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator"

export class CreateServiceDto {
    
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsNumber()
    @IsNotEmpty()
    price: number

    @IsUUID()
    @IsNotEmpty()
    specialization_id: string
    
}