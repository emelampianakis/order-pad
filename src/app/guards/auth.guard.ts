import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { from, map, Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return from(authService.getAccessToken()).pipe(
    map((token) => {
      if (token) {
        return true;
      }
      return router.createUrlTree(["/"]);
    })
  );
};
