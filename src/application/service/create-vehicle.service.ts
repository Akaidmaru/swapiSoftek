import { Injectable, Inject } from '@nestjs/common';
import { CreateVehicleUseCase } from '../ports/input/create-vehicle.use-case';
import { VehicleRepository } from '../ports/output/vehicle-repository.interface';
import {
  VehicleTypeEng,
  VehiclesCreateResponseEng,
} from 'src/domain/entities/vehicles';

@Injectable()
export class CreateVehicleService implements CreateVehicleUseCase {
  constructor(
    @Inject('VehicleRepository')
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(
    vehicleData: VehicleTypeEng,
  ): Promise<VehiclesCreateResponseEng> {
    const id = await this.vehicleRepository.create(vehicleData);
    return {
      id,
      message: `Vehicle ${vehicleData.name} created successfully`,
    };
  }
}
