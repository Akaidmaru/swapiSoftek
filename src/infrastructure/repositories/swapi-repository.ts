import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { SwapiRepository } from '../../application/ports/output/swapi-repository.interface';
import { PeopleTypeEng } from 'src/domain/entities/people.entity';

@Injectable()
export class AxiosSwapiRepository implements SwapiRepository {
  async getPeople(): Promise<PeopleTypeEng> {
    const response = await axios.get('https://swapi.py4e.com/api/people');
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.data;
  }
}
