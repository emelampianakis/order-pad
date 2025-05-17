import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import {
  IonContent,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  AlertController,
} from "@ionic/angular/standalone";
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

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    const orderId = this.route.snapshot.paramMap.get("id");

    // Simulated fetch (replace with real service call)
    this.loadOrder(orderId);
  }

  goBack() {
    this.location.back();
  }

  loadOrder(id: string | null) {
    // Replace with actual data source or API call
    this.order = {
      id: id || "unknown",
      status: "open",
      user: "George",
      tableName: "Table 4",
      date: "2025-05-15 20:32",
      total: 62.5,
      products: [
        { name: "Pizza Margherita", quantity: 2, price: 12 },
        { name: "Coke", quantity: 3, price: 2.5 },
        { name: "Tiramisu", quantity: 1, price: 6 },
        { name: "Pizza Margherita", quantity: 2, price: 12 },
        { name: "Coke", quantity: 3, price: 2.5 },
        { name: "Tiramisu", quantity: 1, price: 6 },
        { name: "Pizza Margherita", quantity: 2, price: 12 },
        { name: "Coke", quantity: 3, price: 2.5 },
        { name: "Tiramisu", quantity: 1, price: 6 },
        { name: "Pizza Margherita", quantity: 2, price: 12 },
        { name: "Coke", quantity: 3, price: 2.5 },
        { name: "Tiramisu", quantity: 1, price: 6 },
      ],
    };
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
            console.log("Order deleted");
            this.goBack();
          },
        },
      ],
    });

    await alert.present();
  }
}
