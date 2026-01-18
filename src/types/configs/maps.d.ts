export interface MapPlace {
  id: string;
  name: string;
  city?: string;
  country?: string;
  lat: number;
  lng: number;
  visitedOn?: string;
  notes?: string;
}

export interface MapsData {
  places: MapPlace[];
}
