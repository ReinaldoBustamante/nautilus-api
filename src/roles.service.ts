import { Injectable, InternalServerErrorException, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "./prisma.service";


export enum RoleName {
  ADMIN = 'administrator',
  DOCTOR = 'doctor',
  PATIENT = 'patient',
}

@Injectable()
export class RoleService implements OnModuleInit {
  private rolesCache = new Map<string, string>();

  constructor(private prisma: PrismaService) {}

  // Se ejecuta automáticamente cuando inicia el servidor
  async onModuleInit() {
    const roles = await this.prisma.role.findMany();
    roles.forEach(role => {
      this.rolesCache.set(role.name, role.id);
    });
  }

  getRoleId(name: RoleName): string {
    const id = this.rolesCache.get(name);
    if (!id) {
      throw new InternalServerErrorException(`Role ${name} not found in database`);
    }
    return id;
  }
}