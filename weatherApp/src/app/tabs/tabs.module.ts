import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { TabsPageRoutingModule } from "./tabs.router.module";

import { TabsPage } from "./tabs.page";
import { HistoryPageModule } from "../history/history.module";
import { ForecastPageModule } from "../forecast/forecast.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    ForecastPageModule,
    HistoryPageModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
