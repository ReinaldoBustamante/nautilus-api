import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsUUID, Matches, MinLength } from "class-validator";

export class CreateUserDto {

    @IsEmail()
    @IsNotEmpty()
    @Transform(({ value }) => value?.toLowerCase())
    email: string

    @MinLength(8, { message: 'Must be at least 8 characters long' })
    @Matches(/[A-Z]/, { message: 'Must contain at least one uppercase letter' })
    @Matches(/\d/, { message: 'Must contain at least one number' })
    @Matches(/[^A-Za-z0-9]/, { message: 'Must contain at least one symbol' })
    @IsNotEmpty()
    password: string

    @IsNotEmpty()
    @IsUUID()
    role_id: string
}