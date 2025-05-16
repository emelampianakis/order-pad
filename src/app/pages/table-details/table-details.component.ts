import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { Location } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-table-details",
  templateUrl: "./table-details.component.html",
  styleUrls: ["./table-details.component.scss"],
  imports: [CommonModule, IonicModule], // ✅ Required for template

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

  ngOnInit() {}

  goBack() {
    this.location.back();
  }

  goToOrderDetails(order: any) {
    this.router.navigate(["/order", order.id]);
  }
}
