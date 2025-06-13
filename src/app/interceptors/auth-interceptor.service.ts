import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, from, throwError } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(this.authService.getAccessToken()).pipe(
      switchMap((token) =>
        from(this.authService.getDb()).pipe(
          switchMap((db) => {
            let cloned = req;
            if (token) {
              cloned = req.clone({
                headers: req.headers
                  .set("Authorization", `Bearer ${token}`)
                  .set("x-tenant-id", db || ""),
              });
            }
            return next.handle(cloned).pipe(
              catchError((err) => {
                const isAuthError =
                  err instanceof HttpErrorResponse && err.status === 401;
                const isRefreshCall = req.url.includes("/auth/refresh-token");

                if (isAuthError && !isRefreshCall) {
                  // If 401 and not already the refresh endpoint
                  return from(this.authService.refreshToken()).pipe(
                    switchMap((newToken) => {
                      if (newToken) {
                        const retryReq = req.clone({
                          headers: req.headers
                            .set("Authorization", `Bearer ${newToken}`)
                            .set("x-tenant-id", db || ""),
                        });
                        return next.handle(retryReq);
                      } else {
                        // Refresh failed — do not retry, just throw original error
                        return throwError(() => err);
                      }
                    })
                  );
                }

                // If refresh call itself failed or another error
                return throwError(() => err);
              })
            );
          })
        )
      )
    );
  }
}
