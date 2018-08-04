import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { WeatherService } from "../services/weatherService/weather-service.service";
import { HttpClientModule } from "../../../node_modules/@angular/common/http";
import { AlertController } from "../../../node_modules/@ionic/angular";
import { ChartsModule } from "ng2-charts/ng2-charts";
import { HistoryPage } from "./history.page";

describe("HistoryPage", () => {
  let component: HistoryPage;
  let fixture: ComponentFixture<HistoryPage>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [HistoryPage],
      imports: [ChartsModule, HttpClientModule],
      providers: [WeatherService, AlertController],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", async () => {
    expect(component).toBeTruthy();
  });
});
