import { TabType } from "../App";

export type CountryType = {
  name: CountryNameType;
  capital: string[];
  region: string;
  subregion: string;
  continents: string[];
  population: number;
  borders: string[];
  currencies: Object;
  flags: FlagsType;
  cca2?: string;
  tab?: TabType;
  handleChangeTab?: any;
};

export type CountryNameType = {
  common: string;
  official: string;
};

type FlagsType = {
  png: string;
  svg: string;
  alt: string;
};

export type AirportType = {
  iata: string;
  name: string;
  city: string;
};

export type GeoLocationCountryType = {
  results: GeoLocationAddressType[];
};

type GeoLocationAddressType = {
  formatted_address: string;
  address_components: GeoLocationAddressComponentType[];
};

type GeoLocationAddressComponentType = {
  long_name: string;
  short_name: string;
};
