import { IsString, IsUUID, Length, Matches } from "class-validator"
import { IsRut } from "src/common/decorators/isValidRut.decorator";

export class CreateDoctorDto {

    @IsString()
    name: string

    @IsString()
    @IsRut({ message: 'El RUT no es válido o el dígito verificador es incorrecto' })
    @Matches(/^[0-9]+[0-9kK]{1}$/, { message: 'El RUT debe ser sin puntos ni guion' })
    rut: string;

    @IsString()
    @Length(8, 8, { message: 'El número de teléfono debe tener exactamente 8 caracteres' })
    @Matches(/^[0-9]+$/, { message: 'El teléfono solo debe contener números' })
    phone_number: string;

    @IsUUID()
    user_id: string
}
