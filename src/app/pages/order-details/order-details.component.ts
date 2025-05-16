import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { IonicModule } from "@ionic/angular";
import { Location } from "@angular/common";

@Component({
  selector: "app-order-details",
  templateUrl: "./order-details.component.html",
  styleUrls: ["./order-details.component.scss"],
  imports: [CommonModule, IonicModule],
})
export class OrderDetailsComponent implements OnInit {
  order: any;

  constructor(
    private route: ActivatedRoute,
    // private navCtrl: NavController,
    private location: Location
    // private router: Router
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
      ],
    };
  }
}
