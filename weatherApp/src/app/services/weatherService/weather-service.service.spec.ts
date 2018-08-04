import { TestBed, inject } from "@angular/core/testing";

import { WeatherService } from "./weather-service.service";
import { HttpClientModule } from "../../../../node_modules/@angular/common/http";

describe("WeatherService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [WeatherService]
    });
  });

  it("should be created", inject(
    [WeatherService],
    (service: WeatherService) => {
      expect(service).toBeTruthy();
    }
  ));
});

describe("Test lowest, average and highest values business logic.", () => {
  let arrayOfNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [WeatherService]
    });
  });

  it("should be able to return lowest value", inject(
    [WeatherService],
    (service: WeatherService) => {
      expect(service.calculateMinValue(arrayOfNumbers)).toEqual("1.00");
    }
  ));

  it("should be able to return average value", inject(
    [WeatherService],
    (service: WeatherService) => {
      expect(service.calculateAverageValue(arrayOfNumbers)).toEqual("5.00");
    }
  ));

  it("should be able to return maximum value", inject(
    [WeatherService],
    (service: WeatherService) => {
      expect(service.calculateMaxValue(arrayOfNumbers)).toEqual("9.00");
    }
  ));
});
