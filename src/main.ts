import { enableProdMode } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { provideIonicAngular } from "@ionic/angular/standalone";

import { AppComponent } from "./app/app.component";
import { routes } from "./app/app.routes";
import { environment } from "./environments/environment";
import { addIcons } from "ionicons";
import {
  listOutline,
  appsOutline,
  gridOutline,
  chevronBackOutline,
  add,
  logOutOutline,
  personCircleOutline,
} from "ionicons/icons";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";

if (environment.production) {
  enableProdMode();
}

addIcons({
  "list-outline": listOutline,
  "apps-outline": appsOutline,
  "grid-outline": gridOutline,
  "chevron-back-outline": chevronBackOutline,
  add: add,
  "log-out-outline": logOutOutline,
  "person-circle-outline": personCircleOutline,
});

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideIonicAngular(),
    provideHttpClient(withInterceptorsFromDi()),
  ],
});
