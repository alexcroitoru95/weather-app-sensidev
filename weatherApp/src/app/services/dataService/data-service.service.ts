import { Injectable } from "@angular/core";

@Injectable()
export class DataService {
  searchedCities: Array<string>;

  constructor() {
    this.searchedCities = [];
  }

  saveFromForecastSearches(searchedCity) {
    this.searchedCities.push(searchedCity);
  }
}
