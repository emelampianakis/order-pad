import { Component, ElementRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import {
  IonContent,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonSearchbar,
  AlertController,
  LoadingController,
} from "@ionic/angular/standalone";

import { DataService } from "src/app/services/data.service";
import { AuthService } from "src/app/services/auth.service";
import { Preferences } from "@capacitor/preferences";

interface Table {
  id: number;
  label: string;
  user: string;
  totalUnpaidPrice: number;
  status: "available" | "not available";
}

@Component({
  selector: "app-table-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonSearchbar,
  ],
  templateUrl: "./table-dashboard.component.html",
  styleUrls: ["./table-dashboard.component.scss"],
})
export class TableDashboardComponent {
  @ViewChild("scrollArea") scrollArea?: ElementRef;

  username: any;
  filter: "all" | "available" | "not available" = "all";
  searchTerm = "";
  columns = 1;
  statuses = ["available", "not available"];
  currency = "€";

  tables: Table[] = [];
  page = 1;
  limit = 20;
  hasMore = true;
  loading = false;

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private loadingController: LoadingController,
    private dataService: DataService,
    private authService: AuthService
  ) {}

  async ionViewWillEnter() {
    this.username = (await Preferences.get({ key: "user" })).value;
    this.fetchTables(true);
  }

  onScroll(): void {
    const el = this.scrollArea?.nativeElement;
    if (!el || this.loading || !this.hasMore) return;

    const scrollBottom = el.scrollTop + el.clientHeight;
    if (scrollBottom >= el.scrollHeight - 50) {
      this.fetchTables(false);
    }
  }

  cycleColumns() {
    this.columns = this.columns === 3 ? 1 : this.columns + 1;
  }

  get currentIcon(): string {
    return this.columns === 1
      ? "list-outline"
      : this.columns === 2
        ? "grid-outline"
        : "apps-outline";
  }

  getStatusClasses(
    status: string,
    tableStatus: string
  ): { [klass: string]: boolean } {
    const s = status.replace(/\s+/g, "");
    return { [s]: true, active: status === tableStatus };
  }

  getStatusClassName(status: string): string {
    return status.replace(/ /g, "");
  }

  goToTableDetails(table: Table) {
    this.router.navigate(["/table", table.id], { state: { table } });
  }

  async logOut() {
    const alert = await this.alertCtrl.create({
      header: "Confirm Logout",
      message: "Are you sure you want to log out?",
      buttons: [
        { text: "Cancel", role: "cancel" },
        {
          text: "Log Out",
          handler: () => {
            this.authService.logout();
            this.router.navigate([""]);
          },
        },
      ],
    });
    await alert.present();
  }

  async fetchTables(reset = false) {
    if (this.loading) return;

    if (reset) {
      this.page = 1;
      this.tables = [];
      this.hasMore = true;
    }

    this.loading = true;

    const loadingCtrl =
      this.page === 1
        ? await this.loadingController.create({ message: "Loading tables..." })
        : null;

    if (loadingCtrl) await loadingCtrl.present();

    this.dataService
      .getTables({
        page: this.page,
        limit: this.limit,
        search: this.searchTerm.trim(),
        status: this.filter !== "all" ? this.filter : undefined,
      })
      .subscribe({
        next: async (res) => {
          if (loadingCtrl) await loadingCtrl.dismiss();
          const items = res.data.items || [];

          this.tables = reset ? items : [...this.tables, ...items];
          this.hasMore = items.length === this.limit;
          this.page++;

          this.loading = false;
        },
        error: async (err) => {
          if (loadingCtrl) await loadingCtrl.dismiss();
          this.loading = false;
          console.error("Error fetching tables:", err);
        },
      });
  }

  onSearchChange() {
    this.fetchTables(true);
  }

  onFilterChange() {
    this.fetchTables(true);
  }
}
