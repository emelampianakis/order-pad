import { bootstrapApplication } from "@angular/platform-browser";
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from "@angular/router";
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from "@ionic/angular/standalone";

import { routes } from "./app/app.routes";
import { AppComponent } from "./app/app.component";
import { addIcons } from "ionicons";
import {
  listOutline,
  appsOutline,
  gridOutline,
  chevronBackOutline,
  add,
} from "ionicons/icons";

addIcons({
  "list-outline": listOutline,
  "apps-outline": appsOutline,
  "grid-outline": gridOutline,
  "chevron-back-outline": chevronBackOutline,
  add: add,
});
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
