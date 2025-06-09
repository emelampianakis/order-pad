import { inject } from "@angular/core";
import { CanActivateFn, Router, UrlTree } from "@angular/router";
import { map, Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getAuthStatus().pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      }
      return router.createUrlTree(["/"]); // redirect to login if not authenticated
    })
  );
};
