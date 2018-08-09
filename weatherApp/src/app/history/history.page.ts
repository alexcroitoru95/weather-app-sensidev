import { Component, ViewChildren, ViewChild } from "@angular/core";
import { AlertController } from "@ionic/angular";
import { WeatherService } from "../services/weatherService/weather-service.service";
import { DataService } from "../services/dataService/data-service.service";
import { BaseChartDirective } from "ng2-charts/ng2-charts";
import { TemplateCardHistory } from "../interfaces/TemplateCardHistory";
import { Slides } from "ionic-angular";
import "chart.js";

@Component({
  selector: "app-history",
  templateUrl: "history.page.html",
  styleUrls: ["history.page.scss"]
})
export class HistoryPage {
  @ViewChildren(BaseChartDirective)
  baseCharts: BaseChartDirective;
  @ViewChild("slides")
  slides: Slides;

  userInputCity: {};
  searchedCities: Array<string>;
  weatherForecast: any;
  daysForecastArray: Array<any>;
  templateCards: Array<TemplateCardHistory>;
  currentDate: Date;
  pastDate: Date;
  emptyWeatherForecast: boolean;
  showCitiesAlreadySearched: boolean;

  barChartType: string = "bar";
  barChartDaysLabels: string[];
  barChartTemperatureData: number[];
  barChartPressureData: number[];
  barChartHumidityData: number[];

  lowestValueTemp: string;
  lowestValuePressure: string;
  lowestValueHumidity: string;
  averageValueTemp: string;
  averageValuePressure: string;
  averageValueHumidity: string;
  maxValueTemp: string;
  maxValuePressure: string;
  maxValueHumidity: string;

  cardTitleTemperature: string = "Temperature";
  unitOfMeasurementTemperature: string = "°C";
  cardTitlePressure: string = "Pressure";
  unitOfMeasurementPressure: string = "mb";
  cardTitleHumidity: string = "Humidity";
  unitOfMeasurementHumidity: string = "%";

  barChartOptions = {
    maintainAspectRatio: false
  };

  chartBackgroundColors = [
    "rgba(255,99,132,0.6)",
    "rgba(54,162,235,0.6)",
    "rgba(255,206,86,0.6)",
    "rgba(231,233,237,0.6)",
    "rgba(75,192,192,0.6)"
  ];
  chartBorderColor = ["#fff", "#fff", "#fff", "#fff", "#fff"];
  chartPointBackgroundColor = [
    "rgba(255,99,132,1)",
    "rgba(54,162,235,1)",
    "rgba(255,206,86,1)",
    "rgba(231,233,237,1)",
    "rgba(75,192,192,1)"
  ];
  chartPointBorderColor = ["#fff", "#fff", "#fff", "#fff", "#fff"];

  constructor(
    private weatherService: WeatherService,
    private alertController: AlertController,
    private dataService: DataService
  ) {
    this.searchedCities = dataService.searchedCities;
    this.showCitiesAlreadySearched = false;
    this.weatherForecast = {};
    this.daysForecastArray = [];
    this.barChartDaysLabels = [];
    this.barChartTemperatureData = [];
    this.barChartPressureData = [];
    this.barChartHumidityData = [];
    this.currentDate = new Date();
    this.pastDate = new Date();
    this.emptyWeatherForecast = false;
  }

  searchCityHistory(event) {
    this.searchedCities = this.dataService.searchedCities;
    const value = event.target.value;
    if (value.length && value.trim() != "" && this.searchedCities.length) {
      this.showCitiesAlreadySearched = true;

      this.searchedCities = this.searchedCities.filter(item => {
        return item.toLowerCase().indexOf(value.toLowerCase()) > -1;
      });
    } else {
      this.showCitiesAlreadySearched = false;
    }
  }

  selectedCityFromSearchBar(city) {
    this.userInputCity = city;
    this.showCitiesAlreadySearched = false;
    this.getHistoricalData();
  }

  searchByKeyword() {
    this.getHistoricalData();
  }

  async getHistoricalData() {
    this.showCitiesAlreadySearched = false;

    for (let i = 1; i <= 5; i++) {
      if (i === 1) {
        this.pastDate.setDate(this.currentDate.getDate() - 1);
      } else {
        this.currentDate.setDate(this.currentDate.getDate() - 1);
        this.pastDate.setDate(this.currentDate.getDate() - 1);
      }

      await new Promise(resolve => {
        this.weatherService
          .getPastWeatherForecast(
            this.userInputCity,
            this.pastDate.toISOString().substring(0, 10),
            this.currentDate.toISOString().substring(0, 10)
          )
          .subscribe(
            weather => {
              this.weatherForecast = weather;

              if (this.weatherForecast !== null) {
                this.emptyWeatherForecast = false;
                this.daysForecastArray.push(this.weatherForecast.data[0]);
              } else {
                this.emptyWeatherForecast = true;
              }

              resolve();
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
              if (this.daysForecastArray.length === 5) {
                this.showSlides(this.weatherForecast, this.daysForecastArray);
              }
            }
          );
      });
    }
  }

  showSlides(weatherForecast, daysForecastArray) {
    if (weatherForecast != null) {
      this.emptyWeatherForecast = false;
      this.clearChartDataAndRefreshResult();

      daysForecastArray
        .map(item => {
          return item.datetime;
        })
        .forEach(item => this.barChartDaysLabels.push(item));

      daysForecastArray
        .map(item => {
          return item.temp;
        })
        .forEach(item => this.barChartTemperatureData.push(item));

      daysForecastArray
        .map(item => {
          return item.pres;
        })
        .forEach(item => this.barChartPressureData.push(item));

      daysForecastArray
        .map(item => {
          return item.rh;
        })
        .forEach(item => this.barChartHumidityData.push(item));

      this.calculateMaxAvgLowValues();
      this.modifyTemplateCard(
        this.cardTitleTemperature,
        this.unitOfMeasurementTemperature,
        this.lowestValueTemp,
        this.averageValueTemp,
        this.maxValueTemp,
        this.barChartTemperatureData
      );
      this.modifyTemplateCard(
        this.cardTitlePressure,
        this.unitOfMeasurementPressure,
        this.lowestValuePressure,
        this.averageValuePressure,
        this.maxValuePressure,
        this.barChartPressureData
      );
      this.modifyTemplateCard(
        this.cardTitleHumidity,
        this.unitOfMeasurementHumidity,
        this.lowestValueHumidity,
        this.averageValueHumidity,
        this.maxValueHumidity,
        this.barChartHumidityData
      );
      this.setChartsLabelsAndColors();
    } else {
      this.clearChartDataAndRefreshResult();

      this.daysForecastArray = [];
      this.weatherForecast = {};

      return (this.emptyWeatherForecast = true);

      // this.presentAlert(
      //   "Invalid City Name or ID",
      //   "",
      //   "Please enter valid city name or id."
      // );
    }
  }

  modifyTemplateCard(
    cardTitleToBeAddedToArray,
    unitOfMeasurementToBeAddedToArray,
    lowestValueToBeAddedToArray,
    averageValueToBeAddedToArray,
    maxValueToBeAddedToArray,
    barChartDataToBeAddedToArray
  ) {
    let card: TemplateCardHistory = {
      cardTitle: cardTitleToBeAddedToArray,
      unitOfMeasurement: unitOfMeasurementToBeAddedToArray,
      lowestValue: lowestValueToBeAddedToArray,
      averageValue: averageValueToBeAddedToArray,
      maxValue: maxValueToBeAddedToArray,
      barChartData: barChartDataToBeAddedToArray
    };

    this.templateCards.push(card);
  }

  calculateMaxAvgLowValues() {
    this.lowestValueTemp = this.weatherService.calculateMinValue(
      this.barChartTemperatureData
    );
    this.lowestValuePressure = this.weatherService.calculateMinValue(
      this.barChartPressureData
    );
    this.lowestValueHumidity = this.weatherService.calculateMinValue(
      this.barChartHumidityData
    );

    this.averageValueTemp = this.weatherService.calculateAverageValue(
      this.barChartTemperatureData
    );
    this.averageValuePressure = this.weatherService.calculateAverageValue(
      this.barChartPressureData
    );
    this.averageValueHumidity = this.weatherService.calculateAverageValue(
      this.barChartHumidityData
    );

    this.maxValueTemp = this.weatherService.calculateMaxValue(
      this.barChartTemperatureData
    );
    this.maxValuePressure = this.weatherService.calculateMaxValue(
      this.barChartPressureData
    );
    this.maxValueHumidity = this.weatherService.calculateMaxValue(
      this.barChartHumidityData
    );
  }

  setChartsLabelsAndColors() {
    console.log(this.slides);
    //@ts-ignore
    this.baseCharts.changes.subscribe(() => {
      //@ts-ignore
      let charts = this.baseCharts.toArray();
      charts[0].chart.config.data.labels = this.barChartDaysLabels;
      charts[0].chart.config.data.datasets[0].labels = this.unitOfMeasurementTemperature;
      charts[0].chart.config.data.datasets[0].label = this.unitOfMeasurementTemperature;
      charts[1].chart.config.data.labels = this.barChartDaysLabels;
      charts[1].chart.config.data.datasets[0].labels = this.unitOfMeasurementPressure;
      charts[1].chart.config.data.datasets[0].label = this.unitOfMeasurementPressure;
      charts[2].chart.config.data.labels = this.barChartDaysLabels;
      charts[2].chart.config.data.datasets[0].labels = this.unitOfMeasurementHumidity;
      charts[2].chart.config.data.datasets[0].label = this.unitOfMeasurementHumidity;

      charts[0].chart.config.data.datasets[0].backgroundColor = this.chartBackgroundColors;
      charts[0].chart.config.data.datasets[0].borderColor = this.chartBorderColor;
      charts[0].chart.config.data.datasets[0].pointBackgroundColor = this.chartPointBackgroundColor;
      charts[0].chart.config.data.datasets[0].pointBorderColor = this.chartBorderColor;

      charts[1].chart.config.data.datasets[0].backgroundColor = this.chartBackgroundColors;
      charts[1].chart.config.data.datasets[0].borderColor = this.chartBorderColor;
      charts[1].chart.config.data.datasets[0].pointBackgroundColor = this.chartPointBackgroundColor;
      charts[1].chart.config.data.datasets[0].pointBorderColor = this.chartBorderColor;

      charts[2].chart.config.data.datasets[0].backgroundColor = this.chartBackgroundColors;
      charts[2].chart.config.data.datasets[0].borderColor = this.chartBorderColor;
      charts[2].chart.config.data.datasets[0].pointBackgroundColor = this.chartPointBackgroundColor;
      charts[2].chart.config.data.datasets[0].pointBorderColor = this.chartBorderColor;
    });
  }

  clearChartDataAndRefreshResult() {
    this.templateCards = [];
    this.barChartDaysLabels = [];
    this.barChartPressureData = [];
    this.barChartTemperatureData = [];
    this.barChartHumidityData = [];
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
