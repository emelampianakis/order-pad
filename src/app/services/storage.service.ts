import { Injectable } from "@angular/core";
import { Preferences } from "@capacitor/preferences";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  async setItem(key: string, value: string): Promise<void> {
    await Preferences.set({ key, value });
  }

  async getItem(key: string): Promise<string | null> {
    const result = await Preferences.get({ key });
    return result.value;
  }

  async removeItem(key: string): Promise<void> {
    await Preferences.remove({ key });
  }

  async clear(): Promise<void> {
    await Preferences.clear();
  }
}
