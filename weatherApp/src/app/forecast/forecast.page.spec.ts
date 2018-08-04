import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from "@angular/core/testing";
import { ChartsModule } from "ng2-charts/ng2-charts";
import { ForecastPage } from "./forecast.page";
import { WeatherService } from "../services/weatherService/weather-service.service";
import { HttpClientModule } from "../../../node_modules/@angular/common/http";
import { AlertController } from "../../../node_modules/@ionic/angular";
import { By } from "@angular/platform-browser";
import { browser } from "../../../node_modules/protractor";

describe("ForecastPage", () => {
  let component: ForecastPage;
  let fixture: ComponentFixture<ForecastPage>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ForecastPage],
      imports: [ChartsModule, HttpClientModule],
      providers: [WeatherService, AlertController],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForecastPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", async () => {
    expect(component).toBeTruthy();
  });
});

describe("Forecast Page -> Test error handling while entering an invalid city name or ID", () => {
  let component: ForecastPage;
  let fixture: ComponentFixture<ForecastPage>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ForecastPage],
      imports: [ChartsModule, HttpClientModule],
      providers: [WeatherService, AlertController],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForecastPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should have emptyWeatherForecast variable set to true (boolean for showing error in html)", async () => {
    let weatherForecast = null;
    expect(component.showSlides(weatherForecast)).toBeTruthy();
  });
});
