import { Injectable, Inject } from '@nestjs/common';
import { VehiclesPaginatedResponseEng } from 'src/domain/entities/vehicles';
import { VehicleRepository } from '../ports/output/vehicle-repository.interface';

@Injectable()
export class GetVehiclesPaginatedService {
  constructor(
    @Inject('VehicleRepository')
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(
    page: number,
    limit: number,
  ): Promise<VehiclesPaginatedResponseEng> {
    return await this.vehicleRepository.findAll(page, limit);
  }
}
