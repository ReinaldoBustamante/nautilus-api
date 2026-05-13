import { IsArray, IsBoolean, IsDateString, IsInt, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { Type } from 'class-transformer';

export class SyncScheduleItemDto {
   
    @IsUUID()
    id!: string;

    @IsUUID()
    @IsOptional() 
    doctor_id?: string;

    @IsBoolean()
    is_available!: boolean;

    @IsOptional() 
    @IsDateString()
    created_at?: string | null;

    @IsOptional() 
    @IsDateString()
    updated_at?: string | null;

    @IsInt()
    day_of_week!: number;

    @IsString()
    start_time!: string;

    @IsString()
    end_time!: string;
}



export class BulkSyncDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SyncScheduleItemDto)
    schedules!: SyncScheduleItemDto[]
}