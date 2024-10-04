import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { AppService } from '../../app.service';
import { PeopleTypeEs } from '../../domain/entities/people.es.entity';
import {
  VehiclesCreateResponseEng,
  VehiclesPaginatedResponseEng,
  VehicleTypeEng,
} from '../../domain/entities/vehicles';
import { HttpError } from 'src/domain/value-objects/http-error.value-object';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('swapi/people')
  async getPeople(): Promise<PeopleTypeEs | HttpError> {
    return await this.appService.getPeopleSwapi();
  }

  @Post('vehicles')
  async createVehicles(
    @Body() vehicleData: VehicleTypeEng,
  ): Promise<VehiclesCreateResponseEng> {
    return await this.appService.createVehicles(vehicleData);
  }
  @Get('vehicles')
  async getVehicles(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<VehiclesPaginatedResponseEng> {
    return await this.appService.getVehiclesPaginated(page, limit);
  }

  @Get('vehicles/:id')
  async getVehicleById(
    @Param('id') id: string,
  ): Promise<VehicleTypeEng | HttpError> {
    return await this.appService.getVehicleById(id);
  }
}
