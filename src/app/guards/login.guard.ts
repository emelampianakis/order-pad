import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { Preferences } from "@capacitor/preferences";

export const loginGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const token = (await Preferences.get({ key: "access_token" })).value;

  if (token) {
    router.navigate(["/dashboard"]);
    return false;
  }

  return true;
};
