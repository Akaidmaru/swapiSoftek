import { PeopleTypeEs } from 'src/domain/entities/people.es.entity';
import { HttpError } from 'src/domain/value-objects/http-error.value-object';

export interface GetPeopleSwapiUseCase {
  execute(): Promise<PeopleTypeEs | HttpError>;
}
