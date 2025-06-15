import { Component, Input } from "@angular/core";
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
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  ModalController,
} from "@ionic/angular/standalone";
import { FormsModule } from "@angular/forms";
import { DataService } from "src/app/services/data.service";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-transfer-order-modal",
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
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
  ],
  templateUrl: "./transfer-order-modal.component.html",
  styleUrls: ["./transfer-order-modal.component.scss"],
})
export class TransferOrderModalComponent {
  @Input() orders: any[] = [];

  selectedOrders: any[] = [];
  availableTables: any[] = [];
  selectedTableId: string | null = null;
  allChecked: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private dataService: DataService
  ) {}

  async ngOnInit() {
    const res = await firstValueFrom(this.dataService.getTablesArray());
    this.availableTables = res.data || [];
  }

  toggleAll() {
    this.selectedOrders = this.allChecked ? [...this.orders] : [];
  }

  isChecked(order: any): boolean {
    return this.selectedOrders.includes(order);
  }

  toggleOrder(order: any) {
    if (this.isChecked(order)) {
      this.selectedOrders = this.selectedOrders.filter((o) => o !== order);
    } else {
      this.selectedOrders.push(order);
    }
  }

  async submitTransfer() {
    const selectedTable = this.availableTables.find(
      (t) => t.id === this.selectedTableId
    );
    if (!selectedTable || this.selectedOrders.length === 0) return;

    const payload = {
      ids: this.selectedOrders.map((o) => o.id),
      table: {
        id: selectedTable.id,
        label: selectedTable.label,
        status: selectedTable.status,
        totalUnpaidPrice: selectedTable.totalUnpaidPrice || 0,
      },
    };

    try {
      await this.dataService.updateOrdersTable(payload).toPromise();
      this.modalCtrl.dismiss({ transferred: true });
    } catch (err) {
      console.error("Transfer failed:", err);
    }
  }
}
