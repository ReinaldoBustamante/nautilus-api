// patients-search.strategy.ts
export interface PatientsSearchStrategy {
  findAll(userId: string): Promise<any>
}