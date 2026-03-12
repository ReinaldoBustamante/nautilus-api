import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";

export const prismaErrorMap = {
    P2000: () => new BadRequestException('Value too long for column'),
    P2001: () => new NotFoundException('Record not found'),
    P2002: () => new ConflictException('Unique constraint failed'),
    P2003: () => new BadRequestException('Foreign key constraint failed'),
    P2004: () => new BadRequestException('Constraint failed'),
    P2005: () => new BadRequestException('Invalid value for column type'),
    P2006: () => new BadRequestException('Invalid value provided'),
    P2007: () => new BadRequestException('Data validation error'),
    P2011: () => new BadRequestException('Null constraint violation'),
    P2012: () => new BadRequestException('Missing required value'),
    P2013: () => new BadRequestException('Missing required argument'),
    P2014: () => new BadRequestException('Invalid relation'),
    P2015: () => new NotFoundException('Related record not found'),
    P2016: () => new BadRequestException('Query interpretation error'),
    P2020: () => new BadRequestException('Value out of range'),
    P2021: () => new NotFoundException('Table does not exist'),
    P2022: () => new NotFoundException('Column does not exist'),
    P2025: () => new NotFoundException('Record to update/delete not found'),
}