import { Module } from '@nestjs/common';
import { AppController } from './presentation/controllers/app.controller';
import { CreateVehicleService } from './application/service/create-vehicle.service';
import { GetVehiclesPaginatedService } from './application/service/get-vehicles-paginated.service';
import { GetVehicleByIdService } from './application/service/get-vehicle-by-id.service';
import { GetPeopleSwapiService } from './application/service/get-people-swapi.service';
import { AxiosSwapiRepository } from './infrastructure/repositories/swapi-repository';
import { DynamoDBVehicleRepository } from './infrastructure/repositories/vehicle-repository';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService, // Add AppService to the providers array
    {
      provide: CreateVehicleService,
      useFactory: (vehicleRepository: DynamoDBVehicleRepository) =>
        new CreateVehicleService(vehicleRepository),
      inject: ['VehicleRepository'],
    },
    {
      provide: GetVehiclesPaginatedService,
      useFactory: (vehicleRepository: DynamoDBVehicleRepository) =>
        new GetVehiclesPaginatedService(vehicleRepository),
      inject: ['VehicleRepository'],
    },
    {
      provide: GetVehicleByIdService,
      useFactory: (vehicleRepository: DynamoDBVehicleRepository) =>
        new GetVehicleByIdService(vehicleRepository),
      inject: ['VehicleRepository'],
    },
    {
      provide: GetPeopleSwapiService,
      useFactory: (swapiRepository: AxiosSwapiRepository) =>
        new GetPeopleSwapiService(swapiRepository),
      inject: ['SwapiRepository'],
    },
    {
      provide: 'VehicleRepository',
      useClass: DynamoDBVehicleRepository,
    },
    {
      provide: 'SwapiRepository',
      useClass: AxiosSwapiRepository,
    },
  ],
})
export class AppModule {}
