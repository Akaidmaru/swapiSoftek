export interface VehicleTypeEng {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  pilots: Pilot[];
  created: string;
  edited: string;
}

export interface Pilot {
  name: string;
  age: number;
  weight: number;
}
export interface VehiclesPaginatedResponseEng {
  data: VehicleTypeEng[];
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
}

export interface VehiclesCreateResponseEng {
  id: string;
  message: string;
}
