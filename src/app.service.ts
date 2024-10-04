import { Injectable } from '@nestjs/common';
import {
  AttributeValue,
  DynamoDBClient,
  ScanCommand,
  ScanCommandInput,
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import axios from 'axios';
import { PeopleTypeEng, Result } from './domain/entities/people.entity';
import { PeopleTypeEs } from './domain/entities/people.es.entity';
import {
  VehicleTypeEng,
  VehiclesCreateResponseEng,
  VehiclesPaginatedResponseEng,
} from './domain/entities/vehicles';
import { HttpError } from './domain/value-objects/http-error.value-object';

@Injectable()
export class AppService {
  private dynamoDb: DynamoDBDocumentClient;

  constructor() {
    const client = new DynamoDBClient({ region: process.env.AWS_REGION });
    this.dynamoDb = DynamoDBDocumentClient.from(client);
  }

  async getPeopleSwapi(): Promise<PeopleTypeEs | HttpError> {
    try {
      const response = await axios.get('https://swapi.py4e.com/api/people');
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const dataEng: PeopleTypeEng = response.data;
      const dataEs: PeopleTypeEs = {
        cuenta: dataEng.count,
        siguiente: dataEng.next,
        anterior: dataEng.previous,
        resultados: dataEng.results.map((result: Result) => ({
          nombre: result.name,
          altura: result.height,
          masa: result.mass,
          color_cabello: result.hair_color,
          color_piel: result.skin_color,
          color_ojos: result.eye_color,
          anio_nacimiento: result.birth_year,
          genero: result.gender,
          mundo_natal: result.homeworld,
          peliculas: result.films,
          especies: result.species,
          vehiculos: result.vehicles,
          naves_estelares: result.starships,
          creado: result.created,
          editado: result.edited,
          url: result.url,
        })),
      };

      return dataEs;
    } catch (e) {
      console.error('Error:', e);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal server error' }),
      };
    }
  }

  async createVehicles(
    body: VehicleTypeEng,
  ): Promise<VehiclesCreateResponseEng> {
    const { name, model, manufacturer, pilots } = body;

    const vehicle: VehicleTypeEng = {
      id: Math.random().toString(36).slice(2, 9),
      name,
      model,
      manufacturer,
      pilots,
      created: new Date().toISOString(),
      edited: new Date().toISOString(),
    };

    const params = {
      TableName: process.env.VEHICLES_TABLE_NAME,
      Item: vehicle,
    };

    try {
      await this.dynamoDb.send(new PutCommand(params));

      const response: VehiclesCreateResponseEng = {
        id: vehicle.id,
        message: `Vehicle ${name} created successfully`,
      };

      return response;
    } catch (error) {
      console.error('Error saving vehicle to DynamoDB:', error);
      throw new Error('Failed to create vehicle');
    }
  }

  async getVehiclesPaginated(
    page: number,
    limit: number,
  ): Promise<VehiclesPaginatedResponseEng> {
    const params: ScanCommandInput = {
      TableName: process.env.VEHICLES_TABLE_NAME,
      Limit: limit,
      ExclusiveStartKey:
        page > 1 ? await this.getLastEvaluatedKey(page, limit) : undefined,
    };

    try {
      const { Items, LastEvaluatedKey } = await this.dynamoDb.send(
        new ScanCommand(params),
      );

      const vehicles = Items as unknown as VehicleTypeEng[];
      const totalItems = await this.getTotalVehiclesCount();
      const totalPages = Math.ceil(totalItems / limit);

      const response: VehiclesPaginatedResponseEng = {
        data: vehicles,
        page,
        limit,
        totalPages,
        totalItems,
        hasNextPage: !!LastEvaluatedKey,
      };

      return response;
    } catch (error) {
      console.error('Error fetching vehicles from DynamoDB:', error);
      throw new Error('Failed to fetch vehicles');
    }
  }

  async getVehicleById(id: string): Promise<VehicleTypeEng | HttpError> {
    const params = {
      TableName: process.env.VEHICLES_TABLE_NAME,
      Key: { id },
    };

    try {
      const { Item } = await this.dynamoDb.send(new GetCommand(params));

      if (!Item) {
        return {
          statusCode: 404,
          body: `Vehicle with id ${id} not found`,
        };
      }

      return Item as VehicleTypeEng;
    } catch (error) {
      console.error('Error fetching vehicle from DynamoDB:', error);
      throw new Error('Failed to fetch vehicle');
    }
  }

  private async getTotalVehiclesCount(): Promise<number> {
    const params: ScanCommandInput = {
      TableName: process.env.VEHICLES_TABLE_NAME,
      Select: 'COUNT',
    };
    try {
      const result = await this.dynamoDb.send(new ScanCommand(params));
      return result.Count || 0;
    } catch (error) {
      console.error('Error counting vehicles:', error);
      return 0;
    }
  }

  private async getLastEvaluatedKey(
    page: number,
    limit: number,
  ): Promise<Record<string, AttributeValue> | undefined> {
    if (page <= 1) {
      return undefined;
    }

    const params: ScanCommandInput = {
      TableName: process.env.VEHICLES_TABLE_NAME,
      Limit: (page - 1) * limit,
      ProjectionExpression: 'id',
    };

    try {
      const { LastEvaluatedKey } = await this.dynamoDb.send(
        new ScanCommand(params),
      );
      return LastEvaluatedKey;
    } catch (error) {
      console.error('Error getting last evaluated key:', error);
      return undefined;
    }
  }
}
