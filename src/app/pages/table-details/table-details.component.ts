import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
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
} from "@ionic/angular/standalone";
import { AddOrderModalComponent } from "src/app/components/add-order-modal.component";

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
  table = {
    name: "Table 7",
    status: "closed",
    user: "John D.",
    orderGroups: [
      {
        total: 42.5,
        orders: [
          {
            id: 1213123,
            time: "14:12",
            date: "2025-05-16",
            orderId: "12345",
            price: 12,
            user: "John D.",
          },
          {
            id: 1213124,
            time: "14:14",
            date: "2025-05-16",
            orderId: "sadasdad",
            price: 2.5,
            user: "Frank",
          },
        ],
      },
      {
        total: 42.5,
        orders: [
          {
            id: 1213123,

            time: "14:12",
            date: "2025-05-16",
            orderId: "12345",
            price: 12,
            user: "John D.",
          },
          {
            id: 1213124,
            time: "14:14",
            date: "2025-05-16",
            orderId: "sadasdad",
            price: 2.5,
            user: "Frank",
          },
        ],
      },
      {
        total: 42.5,
        orders: [
          {
            id: 1213123,

            time: "14:12",
            date: "2025-05-16",
            orderId: "12345",
            price: 12,
            user: "John D.",
          },
          {
            id: 1213124,
            time: "14:14",
            date: "2025-05-16",
            orderId: "sadasdad",
            price: 2.5,
            user: "Frank",
          },
        ],
      },
      {
        total: 42.5,
        orders: [
          {
            id: 1213123,
            time: "14:12",
            date: "2025-05-16",
            orderId: "12345",
            price: 12,
            user: "John D.",
          },
          {
            id: 1213124,
            time: "14:14",
            date: "2025-05-16",
            orderId: "sadasdad",
            price: 2.5,
            user: "Frank",
          },
        ],
      },
      {
        total: 42.5,
        orders: [
          {
            id: 1213123,

            time: "14:12",
            date: "2025-05-16",
            orderId: "12345",
            price: 12,
            user: "John D.",
          },
          {
            id: 1213124,
            time: "14:14",
            date: "2025-05-16",
            orderId: "sadasdad",
            price: 2.5,
            user: "Frank",
          },
        ],
      },
      {
        total: 42.5,
        orders: [
          {
            id: 1213123,
            time: "14:12",
            date: "2025-05-16",
            orderId: "12345",
            price: 12,
            user: "John D.",
          },
          {
            id: 1213124,
            time: "14:14",
            date: "2025-05-16",
            orderId: "sadasdad",
            price: 2.5,
            user: "Frank",
          },
        ],
      },
      {
        total: 28,
        orders: [
          {
            id: 1213123,
            time: "14:30",
            date: "2025-05-16",
            orderId: "1231323",
            price: 10,
            user: "Eve",
          },
          {
            id: 1213124,
            time: "14:33",
            date: "2025-05-16",
            orderId: "41424",
            price: 1.5,
            user: "Alice",
          },
        ],
      },
    ],
  };

  constructor(
    private location: Location,
    private router: Router
  ) {}
  private modalCtrl: ModalController = inject(ModalController);

  ngOnInit() {}

  goBack() {
    this.location.back();
  }

  goToOrderDetails(order: any) {
    this.router.navigate(["/order", order.id]);
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
}
