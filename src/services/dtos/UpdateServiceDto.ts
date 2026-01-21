import { IsNumber, IsOptional, IsString, IsUUID } from "class-validator"

export class UpdateServiceDto {
    @IsString()
    @IsOptional()
    name: string

    @IsString()
    @IsOptional()
    description: string

    @IsNumber()
    @IsOptional()
    price: number

    @IsUUID()
    @IsOptional()
    specialization_id: string
}