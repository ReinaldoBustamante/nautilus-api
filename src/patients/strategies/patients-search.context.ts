import { Injectable } from "@nestjs/common";
import { AdminPatientsStrategy } from "./impl/admin-search.strategy";

import { PatientsSearchStrategy } from "./interface/patients-search.strategy";
import { DoctorPatientsStrategy } from "./impl/doctor-search.strategy";

@Injectable()
export class PatientsStrategyContext {
    constructor(
        private adminStrategy: AdminPatientsStrategy,
        private doctorStrategy: DoctorPatientsStrategy,
    ) { }

    getStrategy(role: string): PatientsSearchStrategy {
        if (role === 'ADMIN') return this.adminStrategy;
        if (role === 'DOCTOR') return this.doctorStrategy;
        throw new Error('Rol no soportado');
    }
}