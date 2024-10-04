import {
  VehicleTypeEng,
  VehiclesPaginatedResponseEng,
} from 'src/domain/entities/vehicles';

export interface VehicleRepository {
  create(vehicle: VehicleTypeEng): Promise<string>;
  findAll(page: number, limit: number): Promise<VehiclesPaginatedResponseEng>;
  findById(id: string): Promise<VehicleTypeEng | null>;
  count(): Promise<number>;
}
