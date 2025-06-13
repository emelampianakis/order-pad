import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, firstValueFrom, map, catchError, of } from "rxjs";
import { Preferences } from "@capacitor/preferences";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "https://www.florder.gr:3100";
  private accessTokenKey = "access_token";
  private dbKey = "db";

  constructor(private http: HttpClient) {
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
        await Preferences.set({ key: this.dbKey, value: res.db });
        return res;
      })
    );
  }

  async logout() {
    await Preferences.remove({ key: this.accessTokenKey });
    await Preferences.remove({ key: this.dbKey });
  }

  async getAccessToken(): Promise<string | null> {
    const result = await Preferences.get({ key: this.accessTokenKey });
    return result.value;
  }

  async getDb(): Promise<string | null> {
    const result = await Preferences.get({ key: this.dbKey });
    return result.value;
  }

  async refreshToken(): Promise<string | null> {
    const expiredToken = await this.getAccessToken();
    if (!expiredToken) {
      await this.logout();
      return null;
    }

    try {
      const response = await firstValueFrom(
        this.http.post<any>(`${this.apiUrl}/auth/refresh-token`, {
          accessToken: expiredToken,
        })
      );

      // store the new accessToken
      await Preferences.set({
        key: this.accessTokenKey,
        value: response.accessToken,
      });

      return response.accessToken;
    } catch (error) {
      await this.logout();
      return null;
    }
  }
}
