import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, Max, Min } from "class-validator"

export class CreateScheduleDto {

    @ApiProperty({ example: '0' })
    @IsNumber()
    @Min(0)
    @Max(6)
    @IsNotEmpty()
    day_of_week!: number

    @ApiProperty({ example: "09:00" })
    @IsString()
    @IsNotEmpty()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: 'El formato de hora debe ser HH:mm (ejemplo: 09:00)',
    })
    start_time!: string

    @ApiProperty({ example: "10:00" })
    @IsString()
    @IsNotEmpty()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: 'El formato de hora debe ser HH:mm (ejemplo: 09:00)',
    })
    end_time!: string

    @ApiProperty({ example: true })
    @IsBoolean()
    @IsOptional()
    is_available!: boolean

}
