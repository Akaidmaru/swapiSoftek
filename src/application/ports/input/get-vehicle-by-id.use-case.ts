import { VehicleTypeEng } from 'src/domain/entities/vehicles';
import { HttpError } from 'src/domain/value-objects/http-error.value-object';

export interface GetVehicleByIdUseCase {
  execute(id: string): Promise<VehicleTypeEng | HttpError>;
}
