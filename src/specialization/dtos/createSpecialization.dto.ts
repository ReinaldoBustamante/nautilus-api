import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, Min } from "class-validator";

export class CreateSpecializationDto {
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value?.toLowerCase())
    name: string
}