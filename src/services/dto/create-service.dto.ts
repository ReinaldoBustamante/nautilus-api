import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateServiceDto {
    @ApiProperty({ example: 'Nombre del servicio' })
    @IsString()
    name: string

    @ApiProperty({ example: 'Descripcion del servicio' })
    @IsString()
    description: string

    @ApiProperty({ example: 20000 })
    @IsNumber()
    price: number

    @ApiProperty({ example: true })
    @IsOptional()
    @IsBoolean()
    is_active: boolean
}
