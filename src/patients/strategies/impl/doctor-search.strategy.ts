import { Injectable } from "@nestjs/common";
import { PatientsSearchStrategy } from "../interface/patients-search.strategy";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class DoctorPatientsStrategy implements PatientsSearchStrategy {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
  
    return this.prisma.patient.findMany({
      where: {
        appointment: {
            some: {
                doctor: {
                  user_id: userId
                }
            }
        }
      }
    });
  }
}