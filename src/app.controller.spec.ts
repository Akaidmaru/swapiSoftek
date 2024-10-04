import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import axios from 'axios';
import {
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandOutput,
  PutCommand,
  PutCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { ScanCommand, ScanCommandOutput } from '@aws-sdk/client-dynamodb';
import { VehicleTypeEng } from './domain/entities/vehicles';

jest.mock('axios');
jest.mock('@aws-sdk/client-dynamodb');
jest.mock('@aws-sdk/lib-dynamodb');

describe('AppService', () => {
  let appService: AppService;
  let mockDynamoDb: jest.Mocked<DynamoDBDocumentClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    appService = module.get<AppService>(AppService);
    mockDynamoDb = {
      send: jest.fn().mockResolvedValue({} as GetCommandOutput),
    } as unknown as jest.Mocked<DynamoDBDocumentClient>;

    // Set the mockDynamoDb on the appService
    appService['dynamoDb'] = mockDynamoDb;
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  describe('getPeopleSwapi', () => {
    it('should return translated people data', async () => {
      const mockResponse = {
        status: 200,
        data: {
          count: 1,
          next: null,
          previous: null,
          results: [
            {
              name: 'Luke Skywalker',
              height: '172',
              mass: '77',
              hair_color: 'blond',
              skin_color: 'fair',
              eye_color: 'blue',
              birth_year: '19BBY',
              gender: 'male',
              homeworld: 'https://swapi.py4e.com/api/planets/1/',
              films: ['https://swapi.py4e.com/api/films/1/'],
              species: [],
              vehicles: ['https://swapi.py4e.com/api/vehicles/14/'],
              starships: ['https://swapi.py4e.com/api/starships/12/'],
              created: '2014-12-09T13:50:51.644000Z',
              edited: '2014-12-20T21:17:56.891000Z',
              url: 'https://swapi.py4e.com/api/people/1/',
            },
          ],
        },
      };

      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await appService.getPeopleSwapi();

      expect(result).toEqual({
        cuenta: 1,
        siguiente: null,
        anterior: null,
        resultados: [
          {
            nombre: 'Luke Skywalker',
            altura: '172',
            masa: '77',
            color_cabello: 'blond',
            color_piel: 'fair',
            color_ojos: 'blue',
            anio_nacimiento: '19BBY',
            genero: 'male',
            mundo_natal: 'https://swapi.py4e.com/api/planets/1/',
            peliculas: ['https://swapi.py4e.com/api/films/1/'],
            especies: [],
            vehiculos: ['https://swapi.py4e.com/api/vehicles/14/'],
            naves_estelares: ['https://swapi.py4e.com/api/starships/12/'],
            creado: '2014-12-09T13:50:51.644000Z',
            editado: '2014-12-20T21:17:56.891000Z',
            url: 'https://swapi.py4e.com/api/people/1/',
          },
        ],
      });
    });

    it('should return an error when the API call fails', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('API error'));

      const result = await appService.getPeopleSwapi();

      expect(result).toEqual({
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal server error' }),
      });
    });
  });

  describe('createVehicles', () => {
    it('should create a vehicle and return a success response', async () => {
      const mockVehicle: VehicleTypeEng = {
        id: '1', // Add this
        name: 'X-wing',
        model: 'T-65 X-wing',
        manufacturer: 'Incom Corporation',
        pilots: [
          {
            name: 'Luke Skywalker',
            age: 0,
            weight: 0,
          },
        ],
        created: new Date().toISOString(),
        edited: new Date().toISOString(),
      };

      mockDynamoDb.send.mockImplementation(() =>
        Promise.resolve({
          $metadata: {},
        } as PutCommandOutput),
      );

      const result = await appService.createVehicles(mockVehicle);

      expect(result).toHaveProperty('id');
      expect(result.message).toBe('Vehicle X-wing created successfully');
      expect(mockDynamoDb.send).toHaveBeenCalledWith(expect.any(PutCommand));
    });
  });

  describe('getVehiclesPaginated', () => {
    it('should return paginated vehicles', async () => {
      const mockItems = [
        { id: '1', name: 'X-wing' },
        { id: '2', name: 'TIE Fighter' },
      ];

      (mockDynamoDb.send as jest.Mock).mockResolvedValueOnce({
        Items: mockItems,
        LastEvaluatedKey: { id: '2' },
        $metadata: {},
      } as unknown as ScanCommandOutput);

      (mockDynamoDb.send as jest.Mock).mockResolvedValueOnce({
        Count: 10,
        $metadata: {},
      } as ScanCommandOutput);

      const result = await appService.getVehiclesPaginated(1, 2);

      expect(result).toEqual({
        data: mockItems,
        page: 1,
        limit: 2,
        totalPages: 5,
        totalItems: 10,
        hasNextPage: true,
      });
      expect(mockDynamoDb.send).toHaveBeenCalledWith(expect.any(ScanCommand));
    });
  });

  describe('getVehicleById', () => {
    it('should return a vehicle when found', async () => {
      const mockVehicle = { id: '1', name: 'X-wing' };

      // Update this part
      (mockDynamoDb.send as jest.Mock).mockResolvedValue({
        Item: mockVehicle,
      } as unknown as GetCommandOutput);

      const result = await appService.getVehicleById('1');

      expect(result).toEqual(mockVehicle);
      expect(mockDynamoDb.send).toHaveBeenCalledWith(expect.any(GetCommand));
    });

    it('should return a 404 error when vehicle is not found', async () => {
      // Update this part as well
      (mockDynamoDb.send as jest.Mock).mockResolvedValue({
        Item: undefined,
      } as GetCommandOutput);

      const result = await appService.getVehicleById('999');

      expect(result).toEqual({
        statusCode: 404,
        body: 'Vehicle with id 999 not found',
      });
    });
  });
});
