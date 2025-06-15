import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  ModalController,
  IonSpinner,
  IonButtons,
  IonNote,
  IonIcon,
  IonBadge,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  AlertController,
  IonTextarea,
} from "@ionic/angular/standalone";
import { FormsModule } from "@angular/forms";
import { DataService } from "src/app/services/data.service";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-add-order-modal",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonTitle,
    IonToolbar,
    IonSpinner,
    IonButtons,
    IonNote,
    IonIcon,
    IonBadge,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonCheckbox,
    FormsModule,
    IonTextarea,
  ],
  templateUrl: "./add-order-modal.component.html",
  styleUrls: ["./add-order-modal.component.scss"],
})
export class AddOrderModalComponent {
  @Input() initialSelectedTable: any = null;

  breadcrumb: { id: string; name: string }[] = [];
  currentCategories: any[] = [];
  currentProducts: any[] = [];
  loading = false;
  cart: any[] = [];
  selectedProduct: any = null;
  view: "categories" | "products" | "product-details" | "cart" = "categories";
  productQuantities: { [productId: string]: number } = {};
  selectedTableId: string | null = null;
  isPaid = false;
  availableTables: any[] = [];
  productNote: string = "";

  onNoteChange(event: any) {
    this.productNote = event.detail.value;
  }

  constructor(
    private dataService: DataService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    await this.loadRootCategories();
    const res = await firstValueFrom(this.dataService.getTablesArray());
    this.availableTables = res.data || [];
    this.selectedTableId = this.initialSelectedTable?.id || null;
  }

  async loadRootCategories() {
    this.loading = true;
    const res = await firstValueFrom(this.dataService.getCategories());
    this.currentCategories = res.data.items;
    this.currentProducts = [];
    this.view = "categories";
    this.loading = false;
  }

  async navigateToCategory(category: any) {
    this.loading = true;
    this.breadcrumb.push({
      id: category.id,
      name: category.name || category.label || "Unnamed",
    });

    const subcats = await firstValueFrom(
      this.dataService.getSubcategories(category.id)
    );

    if (subcats.data.items.length > 0) {
      this.currentCategories = subcats.data.items;
      this.currentProducts = [];
      this.view = "categories";
    } else {
      const prods = await firstValueFrom(
        this.dataService.getCategoryProducts(category.id)
      );
      this.currentProducts = prods.data.items;
      this.currentCategories = [];
      this.view = "products";
    }

    this.loading = false;
  }

  async loadCategoryById(categoryId: string) {
    this.loading = true;
    const subcats = await firstValueFrom(
      this.dataService.getSubcategories(categoryId)
    );

    if (subcats.data.items.length > 0) {
      this.currentCategories = subcats.data.items;
      this.currentProducts = [];
      this.view = "categories";
    } else {
      const prods = await firstValueFrom(
        this.dataService.getCategoryProducts(categoryId)
      );
      this.currentProducts = prods.data.items;
      this.currentCategories = [];
      this.view = "products";
    }

    this.loading = false;
  }

  async viewProduct(product: any) {
    this.loading = true;
    const res = await firstValueFrom(this.dataService.getProduct(product.id));
    this.selectedProduct = res.data;
    this.view = "product-details";
    this.loading = false;
  }

  increaseQuantity(prod: any) {
    const id = prod.id;
    this.productQuantities[id] = (this.productQuantities[id] || 1) + 1;
  }

  decreaseQuantity(prod: any) {
    const id = prod.id;
    const current = this.productQuantities[id] || 1;
    this.productQuantities[id] = Math.max(current - 1, 1);
  }

  async decreaseQuantityCart(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      const alert = await this.alertCtrl.create({
        header: "Remove Item",
        message: `Do you want to remove ${item.label || item.name} from the cart?`,
        buttons: [
          { text: "Cancel", role: "cancel" },
          {
            text: "Remove",
            role: "destructive",
            handler: () => {
              this.removeFromCart(item);
            },
          },
        ],
      });
      await alert.present();
    }
  }

  getQuantity(prod: any): number {
    return this.productQuantities[prod.id] || 1;
  }

  addToCart(product: any) {
    const qty = this.getQuantity(product);
    const existing = this.cart.find((p) => p.id === product.id);

    if (existing) {
      existing.quantity += qty;
      // Optionally append notes
      if (this.productNote) {
        existing.notes = (existing.notes || "") + "\n" + this.productNote;
      }
    } else {
      this.cart.push({
        ...product,
        quantity: qty,
        notes: this.productNote || "",
      });
    }

    // Reset note field after adding
    this.productNote = "";
  }

  removeFromCart(item: any) {
    this.cart = this.cart.filter((p) => p.id !== item.id);
  }

  async clearCart() {
    const alert = await this.alertCtrl.create({
      header: "Clear Cart",
      message: "Are you sure you want to clear the cart?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Clear",
          role: "destructive",
          handler: async () => {
            this.cart = [];

            // Go back to product view if not already there
            if (this.breadcrumb.length > 0) {
              await this.loadCategoryById(
                this.breadcrumb[this.breadcrumb.length - 1].id
              );
            } else {
              await this.loadRootCategories();
            }
          },
        },
      ],
    });

    await alert.present();
  }

  getCartTotal(): number {
    return this.cart.reduce((total, item) => {
      return total + (item.quantity || 1) * item.price;
    }, 0);
  }

  async back() {
    if (this.view === "product-details") {
      this.view = "products";
      return;
    }

    if (this.view === "cart") {
      this.view = "products";
      return;
    }

    this.breadcrumb.pop();

    if (this.breadcrumb.length === 0) {
      await this.loadRootCategories();
    } else {
      const last = this.breadcrumb[this.breadcrumb.length - 1];
      await this.loadCategoryById(last.id);
    }
  }

  toggleCartView() {
    if (this.view === "cart") {
      if (this.breadcrumb.length > 0) {
        this.loadCategoryById(this.breadcrumb[this.breadcrumb.length - 1].id);
      } else {
        this.loadRootCategories();
      }
    } else {
      this.view = "cart";
    }
  }

  get cartToggleIcon(): string {
    return this.view === "cart" ? "apps-outline" : "cart-outline";
  }

  get cartItemCount(): number {
    return this.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }

  async submitOrder() {
    if (!this.selectedTableId || this.cart.length === 0) {
      const alert = await this.alertCtrl.create({
        header: "Missing Information",
        message:
          "Please select a table and add at least one product to the cart.",
        buttons: ["OK"],
      });
      await alert.present();
      return;
    }

    const payload = {
      status: this.isPaid ? "completed" : "pending",
      price: this.getCartTotal(),
      table: {
        id: this.selectedTableId,
      },
      products: this.cart.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        notes: item.notes || "", // Optional: support inline notes later
        productAttributes: item.productAttributes || [], // Placeholder for future
      })),
    };

    try {
      this.loading = true;
      const res = await firstValueFrom(this.dataService.createOrder(payload));
      this.loading = false;

      const alert = await this.alertCtrl.create({
        header: "Success",
        message: "Order has been created successfully.",
        buttons: [
          {
            text: "OK",
            handler: () => this.modalCtrl.dismiss({ success: true }),
          },
        ],
      });

      await alert.present();
    } catch (error) {
      this.loading = false;
      const alert = await this.alertCtrl.create({
        header: "Error",
        message: "Failed to create order. Please try again.",
        buttons: ["OK"],
      });
      await alert.present();
    }
  }
}
