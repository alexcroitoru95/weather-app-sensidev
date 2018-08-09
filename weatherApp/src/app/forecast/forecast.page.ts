import { Component, ViewChildren } from "@angular/core";
import { AlertController } from "@ionic/angular";
import { WeatherService } from "../services/weatherService/weather-service.service";
import { DataService } from "../services/dataService/data-service.service";
import { BaseChartDirective } from "ng2-charts/ng2-charts";
import { TemplateCardForecast } from "../interfaces/TemplateCardForecast";
import "chart.js";

@Component({
  selector: "app-forecast",
  templateUrl: "forecast.page.html",
  styleUrls: ["forecast.page.scss"]
})
export class ForecastPage {
  @ViewChildren(BaseChartDirective)
  baseCharts: BaseChartDirective;

  userInputCity: {};
  weatherForecast: any;
  emptyWeatherForecast: boolean;
  templateCards: Array<TemplateCardForecast>;
  daysForecastArray: Array<any>;

  barChartType: string = "bar";
  barChartDaysLabels: string[];
  barChartTemperatureData: number[];
  barChartPrecipitationData: number[];

  barChartOptions = {
    maintainAspectRatio: false
  };

  cardTitleTemperature: string = "Temperature";
  cardTitlePrecipitation: string = "Precipitation";
  unitOfMeasurementTemperature: string = "°C";
  unitOfMeasurementPrecipitation: string = "mm";

  constructor(
    private weatherService: WeatherService,
    private alertController: AlertController,
    private dataService: DataService
  ) {
    this.weatherForecast = {};
    this.daysForecastArray = [];
    this.barChartDaysLabels = [];
    this.barChartTemperatureData = [];
    this.barChartPrecipitationData = [];
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
      this.dataService.saveFromForecastSearches(this.userInputCity);
      this.clearChartDataAndRefreshResult();

      this.daysForecastArray = weatherForecast.data.splice(0, 5);

      this.daysForecastArray
        .map(item => {
          return item.valid_date;
        })
        .forEach(item => this.barChartDaysLabels.push(item));

      this.daysForecastArray
        .map(item => {
          return item.temp;
        })
        .forEach(item => this.barChartTemperatureData.push(item));

      this.daysForecastArray
        .map(item => {
          return item.precip;
        })
        .forEach(item => this.barChartPrecipitationData.push(item));

      //Only Precipitation Chart can have all values 0.
      // this.checkIfChartArraysAreEmpty(this.barChartPrecipitationData);

      this.modifyTemplateCard(
        this.cardTitleTemperature,
        this.unitOfMeasurementTemperature,
        this.barChartTemperatureData
      );
      this.modifyTemplateCard(
        this.cardTitlePrecipitation,
        this.unitOfMeasurementPrecipitation,
        this.barChartPrecipitationData
      );
      this.setChartsLabels();
    } else {
      this.clearChartDataAndRefreshResult();

      this.daysForecastArray = [];
      this.weatherForecast = {};

      return (this.emptyWeatherForecast = true);
    }
  }

  // checkIfChartArraysAreEmpty(arrayToCheck) {
  //   if (
  //     arrayToCheck.every(value => {
  //       return value == 0;
  //     })
  //   ) {
  //     this.emptyChartArray = true;
  //   } else {
  //     this.emptyChartArray = false;
  //   }
  // }

  modifyTemplateCard(
    cardTitleToBeAddedToArray,
    unitOfMeasurementToBeAddedToArray,
    barChartDataToBeAddedToArray
  ) {
    let card: TemplateCardForecast = {
      cardTitle: cardTitleToBeAddedToArray,
      unitOfMeasurement: unitOfMeasurementToBeAddedToArray,
      barChartData: barChartDataToBeAddedToArray
    };

    this.templateCards.push(card);
  }

  setChartsLabels() {
    //@ts-ignore
    this.baseCharts.changes.subscribe(() => {
      //@ts-ignore
      let charts = this.baseCharts.toArray();
      // for(let i=0; i <= charts.length; i++){
      //   charts[i].chart.config.data.datasets[0].label = this.unitsOfMeasurement[i];
      // }
      charts[0].chart.config.data.datasets[0].label = this.unitOfMeasurementTemperature;
      charts[1].chart.config.data.datasets[0].label = this.unitOfMeasurementPrecipitation;
    });
  }

  clearChartDataAndRefreshResult() {
    this.templateCards = [];
    this.barChartDaysLabels = [];
    this.barChartPrecipitationData = [];
    this.barChartTemperatureData = [];
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
