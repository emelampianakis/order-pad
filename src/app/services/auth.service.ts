import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom, map } from "rxjs";
import { Preferences } from "@capacitor/preferences";
import { Router } from "@angular/router";
import { AlertController, LoadingController } from "@ionic/angular/standalone";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "https://www.florder.gr:3100";
  private accessTokenKey = "access_token";
  private refreshTokenKey = "refresh_token";
  private dbKey = "db";

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingController: LoadingController
  ) {
    this.init();
  }

  private async init() {
    const token = await this.getAccessToken();
  }

  login(credentials: { username: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/auth/sign-in`, credentials).pipe(
      map(async (res) => {
        await Preferences.set({
          key: this.accessTokenKey,
          value: res.accessToken,
        });
        await Preferences.set({
          key: this.refreshTokenKey,
          value: res.refreshToken,
        });
        await Preferences.set({ key: this.dbKey, value: res.db });
        return res;
      })
    );
  }

  async logout() {
    await Preferences.clear();
  }

  async getAccessToken(): Promise<string | null> {
    const result = await Preferences.get({ key: this.accessTokenKey });
    return result.value;
  }

  async getRefreshToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: this.refreshTokenKey });
    return value || null;
  }

  async getDb(): Promise<string | null> {
    const result = await Preferences.get({ key: this.dbKey });
    return result.value;
  }

  async refreshToken(): Promise<string | null> {
    const refreshToken = await this.getRefreshToken();
    if (!refreshToken) {
      await this.onSessionExpired();
      return null;
    }

    try {
      const response = await firstValueFrom(
        this.http.post<any>(`${this.apiUrl}/auth/refresh-token`, {
          refreshToken,
        })
      );

      await Preferences.set({
        key: this.accessTokenKey,
        value: response.accessToken,
      });

      if (response.refreshToken) {
        await Preferences.set({
          key: this.refreshTokenKey,
          value: response.refreshToken,
        });
      }

      return response.accessToken;
    } catch (error) {
      await this.onSessionExpired();
      return null;
    }
  }

  async onSessionExpired() {
    const loader = await this.loadingController.getTop();
    if (loader) {
      await loader.dismiss();
    }
    await Preferences.clear();

    const alert = await this.alertCtrl.create({
      header: "Session Expired",
      message: "Your session has expired. Please log in again.",
      buttons: ["OK"],
    });

    await alert.present();
    await alert.onDidDismiss();

    this.router.navigate([""]);
  }
}
