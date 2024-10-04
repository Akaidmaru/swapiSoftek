import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  ScanCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { VehicleRepository } from '../../application/ports/output/vehicle-repository.interface';
import {
  VehicleTypeEng,
  VehiclesPaginatedResponseEng,
} from 'src/domain/entities/vehicles';

@Injectable()
export class DynamoDBVehicleRepository implements VehicleRepository {
  private dynamoDb: DynamoDBDocumentClient;

  constructor() {
    const client = new DynamoDBClient({ region: process.env.AWS_REGION });
    this.dynamoDb = DynamoDBDocumentClient.from(client);
  }

  async create(vehicle: VehicleTypeEng): Promise<string> {
    const params = {
      TableName: process.env.VEHICLES_TABLE_NAME,
      Item: vehicle,
    };

    await this.dynamoDb.send(new PutCommand(params));
    return vehicle.id;
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<VehiclesPaginatedResponseEng> {
    const params = {
      TableName: process.env.VEHICLES_TABLE_NAME,
      Limit: limit,
      ExclusiveStartKey: page > 1 ? { id: (page - 1) * limit } : undefined,
    };

    const { Items, LastEvaluatedKey } = await this.dynamoDb.send(
      new ScanCommand(params),
    );
    const totalItems = await this.count();
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: Items as VehicleTypeEng[],
      page,
      limit,
      totalPages,
      totalItems,
      hasNextPage: !!LastEvaluatedKey,
    };
  }

  async findById(id: string): Promise<VehicleTypeEng | null> {
    const params = {
      TableName: process.env.VEHICLES_TABLE_NAME,
      Key: { id },
    };

    const { Item } = await this.dynamoDb.send(new GetCommand(params));
    return (Item as VehicleTypeEng) || null;
  }

  async count(): Promise<number> {
    const params: ScanCommandInput = {
      TableName: process.env.VEHICLES_TABLE_NAME,
      Select: 'COUNT',
    };
    const result = await this.dynamoDb.send(new ScanCommand(params));
    return result.Count ?? 0;
  }
}
