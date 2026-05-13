// patients-search.strategy.ts
export interface PatientsSearchStrategy {
  findAll(page: number, limit:number, rut_startWith: string, userId?: string): Promise<any>
}