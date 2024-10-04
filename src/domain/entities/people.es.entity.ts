export interface PeopleTypeEs {
  cuenta: number;
  siguiente: string;
  anterior: null | string | undefined;
  resultados: Resultado[];
}

export interface Resultado {
  nombre: string;
  altura: string;
  masa: string;
  color_cabello: string;
  color_piel: string;
  color_ojos: string;
  anio_nacimiento: string;
  genero: string;
  mundo_natal: string;
  peliculas: string[];
  especies: string[];
  vehiculos: string[];
  naves_estelares: string[];
  creado: string;
  editado: string;
  url: string;
}
