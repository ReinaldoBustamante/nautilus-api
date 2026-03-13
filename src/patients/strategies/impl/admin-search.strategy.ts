import { Injectable } from "@nestjs/common";
import { PatientsSearchStrategy } from "../interface/patients-search.strategy";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class AdminPatientsStrategy implements PatientsSearchStrategy {
    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        return this.prisma.patient.findMany();
    }
}