import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { TabsPage } from "./tabs.page";
import { ForecastPage } from "../forecast/forecast.page";
import { HistoryPage } from "../history/history.page";

const routes: Routes = [
  {
    path: "tabs",
    component: TabsPage,
    children: [
      {
        path: "forecast",
        outlet: "forecast",
        component: ForecastPage
      },
      {
        path: "history",
        outlet: "history",
        component: HistoryPage
      }
    ]
  },
  {
    path: "",
    redirectTo: "/tabs/(forecast:forecast)",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
