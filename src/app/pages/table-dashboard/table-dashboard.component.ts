import { Component } from "@angular/core";
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
  username: any;

  filter: "all" | "available" | "not available" = "all";

  searchTerm = "";
  columns = 1;

  statuses = ["available", "not available"];

  currency = "€";
  tables: Table[] = [];

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private loadingController: LoadingController,
    private dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    this.username = (await Preferences.get({ key: "user" })).value;
    // this.fetchUser();
    this.fetchTables();
  }
  get filteredTables(): Table[] {
    return this.tables
      .filter((t) => (this.filter === "all" ? true : t.status === this.filter))
      .filter((t) => t.label.toString().includes(this.searchTerm.trim()));
  }

  cycleColumns() {
    this.columns = this.columns === 3 ? 1 : this.columns + 1;
  }

  get currentIcon(): string {
    switch (this.columns) {
      case 1:
        return "list-outline";
      case 2:
        return "grid-outline";
      case 3:
        return "apps-outline";
      default:
        return "list-outline";
    }
  }

  getStatusClasses(
    status: string,
    tableStatus: string
  ): { [klass: string]: boolean } {
    const sanitizedStatus = status.replace(/\s+/g, "");
    return {
      [sanitizedStatus]: true,
      active: status === tableStatus,
    };
  }

  getStatusClassName(status: string): string {
    return status.replace(/ /g, "");
  }

  goToTableDetails(table: Table) {
    this.router.navigate(["/table", table.id], {
      state: { table: table },
    });
  }

  async logOut() {
    const alert = await this.alertCtrl.create({
      header: "Confirm Logout",
      message: "Are you sure you want to log out?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {},
        },
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

  async fetchTables() {
    const loading = await this.loadingController.create({
      message: "Loading tables...",
    });
    await loading.present();

    this.dataService.getTables().subscribe({
      next: async (res) => {
        await loading.dismiss();
        this.tables = res.data.items || [];
      },
      error: async (err: any) => {
        console.error(err);
        await loading.dismiss();
      },
    });
  }

  async fetchUser() {
    this.dataService.getUser().subscribe({
      next: async (res) => {
        console.log(res);
      },
      error: async (err: any) => {
        console.error(err);
      },
    });
  }
}
