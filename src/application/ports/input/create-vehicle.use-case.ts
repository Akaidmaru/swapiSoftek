import {
  VehicleTypeEng,
  VehiclesCreateResponseEng,
} from 'src/domain/entities/vehicles';

export interface CreateVehicleUseCase {
  execute(vehicleData: VehicleTypeEng): Promise<VehiclesCreateResponseEng>;
}
