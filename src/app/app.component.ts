import { Component } from "@angular/core";
import { IonApp, IonRouterOutlet } from "@ionic/angular/standalone";
import { Platform } from "@ionic/angular";
import { StatusBar, Style } from "@capacitor/status-bar";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  imports: [IonApp, IonRouterOutlet],
  standalone: true,
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();

    try {
      // Prevent web content from rendering under the status bar
      await StatusBar.setOverlaysWebView({ overlay: false });

      // Set a dark background color (matches your gradient)
      await StatusBar.setBackgroundColor({ color: "#06b6d4" });

      // Use light icons (white) since the background is dark
      await StatusBar.setStyle({ style: Style.Dark });
    } catch (error) {
      console.warn("StatusBar plugin not supported in this environment.");
    }
  }
}
