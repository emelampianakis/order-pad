import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import {
  IonContent,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  AlertController,
  LoadingController,
} from "@ionic/angular/standalone";
import { DataService } from "src/app/services/data.service";
import { finalize } from "rxjs";

@Component({
  selector: "app-order-details",
  templateUrl: "./order-details.component.html",
  styleUrls: ["./order-details.component.scss"],
  imports: [
    CommonModule,
    IonContent,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
  ],
  standalone: true,
})
export class OrderDetailsComponent implements OnInit {
  order: any;
  selectedTable: any;
  selectedOrder: any;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private alertCtrl: AlertController,
    private dataService: DataService,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {
    const orderId = this.route.snapshot.paramMap.get("id");
    this.fetchOrder(orderId);
    const navigation = this.router.getCurrentNavigation();
    this.selectedTable = navigation?.extras.state?.["table"];
    this.selectedOrder = navigation?.extras.state?.["order"];
  }

  goBack() {
    this.location.back();
  }

  async fetchOrder(id: any) {
    const loading = await this.loadingController.create({
      message: "Loading order details...",
    });
    await loading.present();
    if (!id) {
      console.error("No order ID found in route.");
      await loading.dismiss();
      return;
    }
    this.dataService
      .getOrder(id)
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe({
        next: async (res) => {
          this.order = res.data;
        },
        error: async (err: any) => {
          console.error(err);
        },
      });
  }

  async deleteOrder() {
    const alert = await this.alertCtrl.create({
      header: "Confirm Deletion",
      // subHeader: "Delete Order",
      message: "Are you sure you want to delete this order?",
      buttons: [
        {
          text: "No",
          role: "cancel",
          handler: () => {},
        },
        {
          text: "Yes",
          handler: () => {
            this.onDeleteOrder();
          },
        },
      ],
    });

    await alert.present();
  }

  async onDeleteOrder() {
    const loading = await this.loadingController.create({
      message: "Deleting order...",
    });
    await loading.present();
    this.dataService
      .cancelOrder(this.order.id)
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe({
        next: async (res) => {
          this.goBack();
        },
        error: async (err: any) => {
          console.error(err);
        },
      });
  }

  getStatusClassName(status: string): string {
    return status.replace(/ /g, "");
  }
}
