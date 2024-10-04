import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { Handler, Context, Callback } from 'aws-lambda';
import { HttpStatus } from '@nestjs/common';
import { VehicleTypeEng } from './domain/entities/vehicles';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();

export const getPeopleSwapi: Handler = async (
  _event: any,
  _context: Context,
  _callback: Callback,
) => {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const appService = appContext.get(AppService);
  try {
    const response = await appService.getPeopleSwapi();
    return {
      statusCode: HttpStatus.OK,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: HttpStatus.BAD_REQUEST,
      body: JSON.stringify(error.response ?? error.message),
    };
  }
};

export const createVehicle: Handler = async (event: any, _context: Context) => {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const appService = appContext.get(AppService);
  const vehicleData: VehicleTypeEng = JSON.parse(event.body);
  try {
    const response = await appService.createVehicles(vehicleData);
    return {
      statusCode: HttpStatus.CREATED,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: HttpStatus.BAD_REQUEST,
      body: JSON.stringify(error.response ?? error.message),
    };
  }
};

export const getVehicles: Handler = async (event: any, _context: Context) => {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const appService = appContext.get(AppService);
  const { page = '1', limit = '10' } = event.queryStringParameters || {};
  try {
    const response = await appService.getVehiclesPaginated(
      parseInt(page),
      parseInt(limit),
    );
    return {
      statusCode: HttpStatus.OK,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: HttpStatus.BAD_REQUEST,
      body: JSON.stringify(error.response ?? error.message),
    };
  }
};

export const getVehicleById: Handler = async (
  event: any,
  _context: Context,
) => {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const appService = appContext.get(AppService);
  const { id } = event.pathParameters;
  try {
    const response = await appService.getVehicleById(id);
    if ('statusCode' in response && response.statusCode === 404) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        body: JSON.stringify({ message: response.body }),
      };
    }
    return {
      statusCode: HttpStatus.OK,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: HttpStatus.BAD_REQUEST,
      body: JSON.stringify(error.response ?? error.message),
    };
  }
};
