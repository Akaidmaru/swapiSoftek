import { Injectable, Inject } from '@nestjs/common';
import { VehicleTypeEng } from 'src/domain/entities/vehicles';
import { HttpError } from 'src/domain/value-objects/http-error.value-object';
import { VehicleRepository } from '../ports/output/vehicle-repository.interface';

@Injectable()
export class GetVehicleByIdService {
  constructor(
    @Inject('VehicleRepository')
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(id: string): Promise<VehicleTypeEng | HttpError> {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      return {
        statusCode: 404,
        body: `Vehicle with id ${id} not found`,
      };
    }
    return vehicle;
  }
}
