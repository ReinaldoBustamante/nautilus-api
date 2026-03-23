import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID, Length, Matches } from "class-validator"
import { IsRut } from "src/common/decorators/isValidRut.decorator";

export class CreateDoctorDto {

    @ApiProperty({ example: 'Juan Perez'})
    @IsString()
    name: string

    @ApiProperty({ example: '123456789'})
    @IsString()
    @IsRut({ message: 'El RUT no es válido o el dígito verificador es incorrecto' })
    @Matches(/^[0-9]+[0-9kK]{1}$/, { message: 'El RUT debe ser sin puntos ni guion' })
    rut: string;

    @ApiProperty({ example: '12345678'})
    @IsString()
    @Length(8, 8, { message: 'El número de teléfono debe tener exactamente 8 caracteres' })
    @Matches(/^[0-9]+$/, { message: 'El teléfono solo debe contener números' })
    phone_number: string;

    @ApiProperty({ example: '597e82fc-94b1-4611-8a32-9c983584790a'})
    @IsUUID()
    user_id: string
}
