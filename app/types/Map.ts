export interface Location {
  lat: number;
  lng: number;
}

export interface Address {
  street: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}