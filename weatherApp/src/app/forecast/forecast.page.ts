import { Component, ViewChildren, QueryList } from "@angular/core";
import { AlertController } from "@ionic/angular";
import { WeatherService } from "../services/weatherService/weather-service.service";
import { BaseChartDirective } from "ng2-charts/ng2-charts";
import "chart.js";

@Component({
  selector: "app-forecast",
  templateUrl: "forecast.page.html",
  styleUrls: ["forecast.page.scss"]
})
export class ForecastPage {
  @ViewChildren(BaseChartDirective) baseCharts: QueryList<BaseChartDirective>;

  userInputCity: {};
  weatherForecast: any;
  emptyChartArray: boolean;
  emptyWeatherForecast: boolean;
  daysForecastArray: Array<any>;

  doughnutChartType: string = "doughnut";
  doughnutChartDaysLabels: string[];
  doughnutChartTemperatureData: number[];
  doughnutChartPrecipitationData: number[];

  doughnutChartOptions = {
    maintainAspectRatio: false
  };

  constructor(
    private weatherService: WeatherService,
    private alertController: AlertController
  ) {
    this.weatherForecast = {};
    this.daysForecastArray = [];
    this.doughnutChartDaysLabels = [];
    this.doughnutChartTemperatureData = [];
    this.doughnutChartPrecipitationData = [];
    this.emptyChartArray = false;
    this.emptyWeatherForecast = false;
  }

  searchByKeyword() {
    this.weatherService.getFutureWeatherForecast(this.userInputCity).subscribe(
      weather => {
        this.weatherForecast = weather;
      },
      error => {
        this.presentAlert(
          "API Error",
          "",
          "This error is generated due to invalid city name or id or too many requests."
        );
        console.log(error);
      },
      () => {
        this.showSlides(this.weatherForecast);
      }
    );
  }

  showSlides(weatherForecast) {
    if (weatherForecast != null) {
      this.emptyWeatherForecast = false;
      this.clearChartData();

      this.daysForecastArray = weatherForecast.data.splice(0, 5);

      this.daysForecastArray
        .map(item => {
          return item.valid_date;
        })
        .forEach(item => this.doughnutChartDaysLabels.push(item));

      this.daysForecastArray
        .map(item => {
          return item.temp;
        })
        .forEach(item => this.doughnutChartTemperatureData.push(item));

      this.daysForecastArray
        .map(item => {
          return item.precip;
        })
        .forEach(item => this.doughnutChartPrecipitationData.push(item));

      //Only Precipitation Chart can have all values 0.
      this.checkIfChartArraysAreEmpty(this.doughnutChartPrecipitationData);
    } else {
      this.clearChartData();

      this.daysForecastArray = [];
      this.weatherForecast = {};

      return (this.emptyWeatherForecast = true);
    }
  }

  checkIfChartArraysAreEmpty(arrayToCheck) {
    if (
      arrayToCheck.every(value => {
        return value == 0;
      })
    ) {
      this.emptyChartArray = true;
    } else {
      this.emptyChartArray = false;
    }
  }

  clearChartData() {
    this.doughnutChartDaysLabels = [];
    this.doughnutChartPrecipitationData = [];
    this.doughnutChartTemperatureData = [];
    this.emptyChartArray = false;
  }

  async presentAlert(headerMessage, subHeaderMessage, alertMessage) {
    const alert = await this.alertController.create({
      header: headerMessage,
      subHeader: subHeaderMessage,
      message: alertMessage,
      buttons: ["Ok"]
    });

    await alert.present();
  }
}
