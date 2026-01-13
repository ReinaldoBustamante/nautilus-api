import { IsNumber, IsOptional, IsString } from "class-validator"

export class UpdateServiceDto {

    @IsOptional()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    description: string

    @IsOptional()
    @IsNumber()
    price: number

    @IsOptional()
    @IsString()
    specialization_id: string
}