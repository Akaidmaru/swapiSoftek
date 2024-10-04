import { VehiclesPaginatedResponseEng } from 'src/domain/entities/vehicles';

export interface GetVehiclesPaginatedUseCase {
  execute(page: number, limit: number): Promise<VehiclesPaginatedResponseEng>;
}
