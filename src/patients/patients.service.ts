import { ForbiddenException, Injectable } from '@nestjs/common';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PrismaService } from 'src/prisma.service';
import { PatientsStrategyContext } from './strategies/patients-search.context';
import { prismaErrorMap } from 'src/common/errors/prisma.errors';

@Injectable()
export class PatientsService {
  constructor(
    private readonly prismService: PrismaService,
    private readonly strategyContext: PatientsStrategyContext
  ) { }

  async findAll(req: Request) {
    const user = req['user'];
    const strategy = this.strategyContext.getStrategy(user.role);
    return strategy.findAll(user.id);
  }

  async update(id: string, updatePatientDto: UpdatePatientDto, userId: string) {
    try {
      const relation = await this.prismService.appointment.findFirst({
        where: {
          patient_id: id,
          doctor: {
            user_id: userId
          }
        }
      })
      if (!relation) throw new ForbiddenException('No puedes editar este paciente')
      return await this.prismService.patient.update({
        where: { id, },
        data: updatePatientDto
      })
    } catch (err) {
      const handler = prismaErrorMap[err.code]
      if (handler) throw handler()
      throw err
    }
  }

  async findAllPatientAppointments(patientId: string, userId: string) {
    try {
      const patientAppointments = await this.prismService.appointment.findMany({
        where: { patient_id: patientId, doctor: { user_id: userId } }
      })
      return patientAppointments
    } catch (err) {
      const handler = prismaErrorMap[err.code]
      if (handler) throw handler()
      throw err
    }
  }

}
