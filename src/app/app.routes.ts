import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { TableDashboardComponent } from "./pages/table-dashboard/table-dashboard.component";

export const routes: Routes = [
  {
    path: "",
    component: LoginComponent,
  },
  { path: "dashboard", component: TableDashboardComponent },

  // You can add other routes later for your app after login
];
