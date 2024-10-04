import { PeopleTypeEng } from 'src/domain/entities/people.entity';

export interface SwapiRepository {
  getPeople(): Promise<PeopleTypeEng>;
}
