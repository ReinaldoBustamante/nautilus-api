import { Injectable } from "@nestjs/common";
import { PatientsSearchStrategy } from "../interface/patients-search.strategy";
import { PrismaService } from "src/prisma.service";
import { startWith } from "rxjs";

@Injectable()
export class DoctorPatientsStrategy implements PatientsSearchStrategy {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(page: number, limit: number, rut_startWith: string, userId: string) {

    const [patients, totalPatients] = await Promise.all([
      this.prisma.patient.findMany({
        where: {
          appointment: {
            some: {
              doctor: {
                user_id: userId
              }
            }
          },
          rut: {
            startsWith: rut_startWith
          }
        },

        skip: (page - 1) * limit,
        take: limit,

        include: {
          _count: {
            select: {
              appointment: true
            }
          }
        }
      }),

      this.prisma.patient.count({
        where: {
          appointment: {
            some: {
              doctor: {
                user_id: userId
              }
            }
          },
          rut: {
            startsWith: rut_startWith
          }
        }
      })
    ]);

    const patientsWithAppointmentsCount = patients.map(({ _count, ...patient }) => ({
      ...patient,
      appointmentsCount: _count.appointment
    }));

    return {
      data: patientsWithAppointmentsCount,
      meta: {
        totalPatients,
        page,
        limit,
        totalPages: Math.ceil(totalPatients / limit)
      }
    };

  }
}