import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import "rxjs/add/operator/map";

interface weatherApiObject {
  weatherApiKey?: string;
  weatherApiUrl?: string;
}

@Injectable()
export class WeatherService {
  weatherApiObject: weatherApiObject = {};

  constructor(public http: HttpClient) {
    this.weatherApiObject.weatherApiKey = "3c25f83f7d684133bc089a882efc297d";
  }

  getFutureWeatherForecast(userInputCity) {
    if (!isNaN(userInputCity) && userInputCity.trim().length > 0) {
      this.weatherApiObject.weatherApiUrl = `https://api.weatherbit.io/v2.0/forecast/daily?city_id=${userInputCity}&key=${
        this.weatherApiObject.weatherApiKey
      }`;
    } else {
      this.weatherApiObject.weatherApiUrl = `https://api.weatherbit.io/v2.0/forecast/daily?city=${userInputCity}&key=${
        this.weatherApiObject.weatherApiKey
      }`;
    }

    return this.http
      .get(this.weatherApiObject.weatherApiUrl)
      .map(response => response);
  }

  getPastWeatherForecast(userInputCity, startDate, endDate) {
    if (!isNaN(userInputCity) && userInputCity.trim().length > 0) {
      this.weatherApiObject.weatherApiUrl = `https://api.weatherbit.io/v2.0/history/daily?city_id=${userInputCity}&start_date=${startDate}&end_date=${endDate}&key=${
        this.weatherApiObject.weatherApiKey
      }`;
    } else {
      this.weatherApiObject.weatherApiUrl = `https://api.weatherbit.io/v2.0/history/daily?city=${userInputCity}&start_date=${startDate}&end_date=${endDate}&key=${
        this.weatherApiObject.weatherApiKey
      }`;
    }

    return this.http
      .get(this.weatherApiObject.weatherApiUrl)
      .map(response => response);
  }

  calculateMaxValue(arrayOfNumbers) {
    return Math.max(...arrayOfNumbers).toFixed(2);
  }

  calculateMinValue(arrayOfNumbers) {
    return Math.min(...arrayOfNumbers).toFixed(2);
  }

  calculateAverageValue(arrayOfNumbers) {
    let sum = arrayOfNumbers.reduce(
      (previous, current) => (current += previous)
    );
    let average = sum / arrayOfNumbers.length;
    return average.toFixed(2);
  }
}
