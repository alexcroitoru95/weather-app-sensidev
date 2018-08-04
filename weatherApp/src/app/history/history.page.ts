import { Component, ViewChild, QueryList } from "@angular/core";
import { AlertController } from "@ionic/angular";
import { WeatherService } from "../services/weatherService/weather-service.service";
import { BaseChartDirective } from "ng2-charts/ng2-charts";
import "chart.js";

@Component({
  selector: "app-history",
  templateUrl: "history.page.html",
  styleUrls: ["history.page.scss"]
})
export class HistoryPage {
  @ViewChild("temperatureChart") temperatureChart: BaseChartDirective;
  @ViewChild("pressureChart") pressureChart: BaseChartDirective;
  @ViewChild("humidityChart") humidityChart: BaseChartDirective;

  userInputCity: {};
  weatherForecast: any;
  daysForecastArray: Array<any>;
  currentDate: Date;
  pastDate: Date;

  doughnutChartType: string = "doughnut";
  doughnutChartDaysLabels: string[];
  doughnutChartTemperatureData: number[];
  doughnutChartPressureData: number[];
  doughnutChartHumidityData: number[];

  lowestValueTemp: string;
  lowestValuePressure: string;
  lowestValueHumidity: string;
  averageValueTemp: string;
  averageValuePressure: string;
  averageValueHumidity: string;
  maxValueTemp: string;
  maxValuePressure: string;
  maxValueHumidity: string;

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
    private alertController: AlertController
  ) {
    this.weatherForecast = {};
    this.daysForecastArray = [];
    this.doughnutChartDaysLabels = [];
    this.doughnutChartTemperatureData = [];
    this.doughnutChartPressureData = [];
    this.doughnutChartHumidityData = [];
    this.currentDate = new Date();
    this.pastDate = new Date();
  }

  doughnutChartOptions = {
    maintainAspectRatio: false
  };

  searchByKeyword() {
    this.getHistoricalData();
  }

  async getHistoricalData() {
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
              this.daysForecastArray.push(this.weatherForecast.data[0]);
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
      this.clearChartData();

      daysForecastArray
        .map(item => {
          return item.datetime;
        })
        .forEach(item => this.doughnutChartDaysLabels.push(item));

      daysForecastArray
        .map(item => {
          return item.temp;
        })
        .forEach(item => this.doughnutChartTemperatureData.push(item));

      daysForecastArray
        .map(item => {
          return item.pres;
        })
        .forEach(item => this.doughnutChartPressureData.push(item));

      daysForecastArray
        .map(item => {
          return item.rh;
        })
        .forEach(item => this.doughnutChartHumidityData.push(item));

      this.calculateMaxAvgLowValues();
      this.setChartsLabelsAndColors();
    } else {
      this.clearChartData();

      this.daysForecastArray = [];
      this.weatherForecast = {};

      this.presentAlert(
        "Invalid City Name or ID",
        "",
        "Please enter valid city name or id."
      );
    }
  }

  calculateMaxAvgLowValues() {
    this.lowestValueTemp = this.weatherService.calculateMinValue(
      this.doughnutChartTemperatureData
    );
    this.lowestValuePressure = this.weatherService.calculateMinValue(
      this.doughnutChartPressureData
    );
    this.lowestValueHumidity = this.weatherService.calculateMinValue(
      this.doughnutChartHumidityData
    );

    this.averageValueTemp = this.weatherService.calculateAverageValue(
      this.doughnutChartTemperatureData
    );
    this.averageValuePressure = this.weatherService.calculateAverageValue(
      this.doughnutChartPressureData
    );
    this.averageValueHumidity = this.weatherService.calculateAverageValue(
      this.doughnutChartHumidityData
    );

    this.maxValueTemp = this.weatherService.calculateMaxValue(
      this.doughnutChartTemperatureData
    );
    this.maxValuePressure = this.weatherService.calculateMaxValue(
      this.doughnutChartPressureData
    );
    this.maxValueHumidity = this.weatherService.calculateMaxValue(
      this.doughnutChartHumidityData
    );
  }

  setChartsLabelsAndColors() {
    this.temperatureChart.chart.config.data.labels = this.doughnutChartDaysLabels;
    this.pressureChart.chart.config.data.labels = this.doughnutChartDaysLabels;
    this.humidityChart.chart.config.data.labels = this.doughnutChartDaysLabels;

    this.temperatureChart.chart.config.data.datasets[0].backgroundColor = this.chartBackgroundColors;
    this.temperatureChart.chart.config.data.datasets[0].borderColor = this.chartBorderColor;
    this.temperatureChart.chart.config.data.datasets[0].pointBackgroundColor = this.chartPointBackgroundColor;
    this.temperatureChart.chart.config.data.datasets[0].pointBorderColor = this.chartBorderColor;

    this.pressureChart.chart.config.data.datasets[0].backgroundColor = this.chartBackgroundColors;
    this.pressureChart.chart.config.data.datasets[0].borderColor = this.chartBorderColor;
    this.pressureChart.chart.config.data.datasets[0].pointBackgroundColor = this.chartPointBackgroundColor;
    this.pressureChart.chart.config.data.datasets[0].pointBorderColor = this.chartBorderColor;

    this.humidityChart.chart.config.data.datasets[0].backgroundColor = this.chartBackgroundColors;
    this.humidityChart.chart.config.data.datasets[0].borderColor = this.chartBorderColor;
    this.humidityChart.chart.config.data.datasets[0].pointBackgroundColor = this.chartPointBackgroundColor;
    this.humidityChart.chart.config.data.datasets[0].pointBorderColor = this.chartBorderColor;
  }

  clearChartData() {
    this.doughnutChartDaysLabels = [];
    this.doughnutChartPressureData = [];
    this.doughnutChartTemperatureData = [];
    this.doughnutChartHumidityData = [];
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
