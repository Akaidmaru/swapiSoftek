import { Injectable, Inject } from '@nestjs/common';
import { PeopleTypeEs } from 'src/domain/entities/people.es.entity';
import { HttpError } from 'src/domain/value-objects/http-error.value-object';
import { PeopleTypeEng, Result } from 'src/domain/entities/people.entity';
import { SwapiRepository } from '../ports/output/swapi-repository.interface';

@Injectable()
export class GetPeopleSwapiService {
  constructor(
    @Inject('SwapiRepository')
    private readonly swapiRepository: SwapiRepository,
  ) {}

  async execute(): Promise<PeopleTypeEs | HttpError> {
    try {
      const dataEng: PeopleTypeEng = await this.swapiRepository.getPeople();

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
}
