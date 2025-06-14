import { Component } from "@angular/core";
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
  IonToggle,
  IonBadge,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  AlertController,
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
    IonToggle,
    IonBadge,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonCheckbox,
  ],
  templateUrl: "./add-order-modal.component.html",
  styleUrls: ["./add-order-modal.component.scss"],
})
export class AddOrderModalComponent {
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

  constructor(
    private dataService: DataService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    await this.loadRootCategories();
    const res = await firstValueFrom(this.dataService.getTables());
    this.availableTables = res.data.items || [];
    this.selectedTableId = this.availableTables[0]?.id || null;
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

  async decreaseQuantity(item: any) {
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
    } else {
      this.cart.push({ ...product, quantity: qty });
    }
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

  confirmOrder() {
    this.modalCtrl.dismiss({
      cart: this.cart,
      tableId: this.selectedTableId,
      isPaid: this.isPaid,
    });
  }
}
