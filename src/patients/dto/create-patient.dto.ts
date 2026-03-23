import { ApiProperty } from "@nestjs/swagger"
import { IsString, Length, Matches } from "class-validator"


export class CreatePatientDto {

    @ApiProperty({ example: '12345678' })
    @IsString()
    @Length(8, 8, { message: 'El número de teléfono debe tener exactamente 8 caracteres' })
    @Matches(/^[0-9]+$/, { message: 'El teléfono solo debe contener números' })
    phone_number: string

    @ApiProperty({ example: 'Calle falsa 123' })
    @IsString()
    address: string
}
