import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalController } from "@ionic/angular/standalone";

import {
  IonContent,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonFab,
  IonFabButton,
  LoadingController,
} from "@ionic/angular/standalone";
import { AddOrderModalComponent } from "src/app/components/add-order-modal.component";
import { DataService } from "src/app/services/data.service";
import { finalize } from "rxjs";
import { PayOrderModalComponent } from "src/app/components/pay-order-modal/pay-order-modal.component";
import { TransferOrderModalComponent } from "src/app/components/transfer-order-modal/transfer-order-modal.component";

@Component({
  selector: "app-table-details",
  templateUrl: "./table-details.component.html",
  styleUrls: ["./table-details.component.scss"],
  imports: [
    CommonModule,
    IonContent,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonFab,
    IonFabButton,
  ],
  standalone: true,
})
export class TableDetailsComponent implements OnInit {
  tableOrders: any[] = [];
  selectedTable: any;

  constructor(
    private location: Location,
    private router: Router,
    private dataService: DataService,
    private loadingController: LoadingController,
    private route: ActivatedRoute
  ) {}
  private modalCtrl: ModalController = inject(ModalController);

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this.selectedTable = navigation?.extras.state?.["table"];
  }

  ngAfterViewInit() {
    this.fetchTableOrders();
  }

  goBack() {
    this.location.back();
  }

  async fetchTableOrders() {
    const loading = await this.loadingController.create({
      message: "Loading orders...",
    });
    await loading.present();
    const tableId = this.route.snapshot.paramMap.get("id");
    if (!tableId) {
      console.error("No table ID found in route.");
      await loading.dismiss();
      return;
    }
    this.dataService
      .getTableOrders(tableId)
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe({
        next: async (res) => {
          this.tableOrders = res.data.items || [];
        },
        error: async (err: any) => {
          console.error(err);
        },
      });
  }

  goToOrderDetails(order: any) {
    this.router.navigate(["/order", order.id], {
      state: { table: this.selectedTable, order: order },
    });
  }

  async openAddOrderModal() {
    const modal = await this.modalCtrl.create({
      component: AddOrderModalComponent,
      breakpoints: [0, 0.2, 0.8],
      initialBreakpoint: 0.8,
      handle: true,
    });
    return await modal.present();
  }

  getStatusClassName(status: string): string {
    return status.replace(/ /g, "");
  }

  async openTransferOrderModal() {
    const modal = await this.modalCtrl.create({
      component: TransferOrderModalComponent,
      componentProps: {
        orders: this.tableOrders,
      },
      breakpoints: [1],
      initialBreakpoint: 1,
      handle: false,
      cssClass: "transfer-modal",
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data?.transferred) {
      this.fetchTableOrders(); // refresh list
    }
  }

  async openPayOrderModal() {
    const modal = await this.modalCtrl.create({
      component: PayOrderModalComponent,
      componentProps: {
        orders: this.tableOrders.filter((o) => !o.paid),
      },
      breakpoints: [1],
      initialBreakpoint: 1,
      handle: false,
      cssClass: "transfer-modal",
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data?.paid) {
      this.fetchTableOrders();
    }
  }
}
