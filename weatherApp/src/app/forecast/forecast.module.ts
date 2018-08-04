import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ForecastPage } from "./forecast.page";
import { ChartsModule } from "ng2-charts/ng2-charts";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: "", component: ForecastPage }]),
    ChartsModule
  ],
  declarations: [ForecastPage]
})
export class ForecastPageModule {}
