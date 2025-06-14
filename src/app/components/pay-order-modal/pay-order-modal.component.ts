import { Component, inject, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
} from "@ionic/angular/standalone";
import { FormsModule } from "@angular/forms";
import { firstValueFrom } from "rxjs";
import { DataService } from "src/app/services/data.service";
import { ModalController } from "@ionic/angular/standalone";

@Component({
  selector: "app-pay-order-modal",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonCheckbox,
    IonContent,
    IonFooter,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonTitle,
    IonToolbar,
  ],
  templateUrl: "./pay-order-modal.component.html",
  styleUrls: ["./pay-order-modal.component.scss"],
})
export class PayOrderModalComponent {
  @Input() orders: any[] = [];

  selectedOrders: any[] = [];
  allChecked = false;

  constructor(private dataService: DataService) {}
  private modalCtrl: ModalController = inject(ModalController);

  toggleAll() {
    this.selectedOrders = this.allChecked ? [...this.orders] : [];
  }

  isChecked(order: any) {
    return this.selectedOrders.includes(order);
  }

  toggleOrder(order: any) {
    if (this.isChecked(order)) {
      this.selectedOrders = this.selectedOrders.filter((o) => o !== order);
    } else {
      this.selectedOrders.push(order);
    }
  }

  getTotal(): number {
    return this.selectedOrders.reduce((sum, o) => sum + o.price, 0);
  }

  async submitPayment() {
    const ids = this.selectedOrders.map((o) => o.id);
    if (!ids.length) return;

    try {
      await firstValueFrom(this.dataService.updatePaidStatus({ ids }));
      this.modalCtrl.dismiss({ paid: true });
    } catch (err) {
      console.error("Payment update failed:", err);
    }
  }
}
