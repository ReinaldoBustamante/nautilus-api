import { IsOptional, IsString } from "class-validator";

export class UpdateSpecializationDto {
    @IsOptional()
    @IsString()
    name: string
}