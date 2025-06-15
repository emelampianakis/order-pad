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
  cartOutline,
} from "ionicons/icons";
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { AuthInterceptor } from "./app/interceptors/auth-interceptor.service";
import { LOCALE_ID, DEFAULT_CURRENCY_CODE } from "@angular/core";
import { registerLocaleData } from "@angular/common";
import localeEl from "@angular/common/locales/el";

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
  "cart-outline": cartOutline,
});

registerLocaleData(localeEl);

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideIonicAngular(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    { provide: LOCALE_ID, useValue: "el" }, // Greek locale
    { provide: DEFAULT_CURRENCY_CODE, useValue: "EUR" }, // Default currency: Euro
  ],
});
