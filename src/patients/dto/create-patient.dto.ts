import { IsEmail, IsString, Length, Matches } from "class-validator"


export class CreatePatientDto {

    @IsString()
    @Length(8, 8, { message: 'El número de teléfono debe tener exactamente 8 caracteres' })
    @Matches(/^[0-9]+$/, { message: 'El teléfono solo debe contener números' })
    phone_number: string

    @IsString()
    address: string
}
