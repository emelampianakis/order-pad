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
  IonRadio,
  IonRadioGroup,
  ToastController,
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
    IonTextarea,
    IonRadio,
    IonRadioGroup,
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

  // Track selected attributes per category
  selectedAttributes: { [categoryId: string]: number | null } = {};
  selectedAttributesMulti: { [categoryId: string]: number[] } = {};

  constructor(
    private dataService: DataService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    await this.loadRootCategories();
    const res = await firstValueFrom(this.dataService.getTablesArray());
    this.availableTables = res.data || [];
    this.selectedTableId = this.initialSelectedTable?.id || null;
  }

  onNoteChange(event: any) {
    this.productNote = event.detail.value;
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
    this.productQuantities[this.selectedProduct.id] = 1;
    this.selectedAttributes = {};
    this.selectedAttributesMulti = {};

    if (this.selectedProduct.productAttributeCategories) {
      this.selectedProduct.productAttributeCategories.forEach((cat: any) => {
        const categoryId = cat.attributeCategory.id;
        if (cat.attributeCategory.selectedValueType === "single") {
          const defaultAttr = cat.attributeCategory.attributes.find(
            (a: any) => a.default === true
          );
          this.selectedAttributes[categoryId] = defaultAttr
            ? defaultAttr.id
            : null;
        } else {
          // Initialize array if empty
          this.selectedAttributesMulti[categoryId] =
            cat.attributeCategory.attributes
              .filter((a: any) => a.default === true)
              .map((a: any) => a.id) || [];
        }
      });
    }

    this.view = "product-details";
    this.loading = false;
  }

  getSelectedProductTotalPrice(): number {
    if (!this.selectedProduct) return 0;

    let basePrice = this.selectedProduct.price || 0;
    let attrPrice = 0;

    // Add price for single selected attributes
    for (const catId in this.selectedAttributes) {
      const attrId = this.selectedAttributes[catId];
      if (attrId) {
        const attrCat = this.selectedProduct.productAttributeCategories.find(
          (c: any) => c.attributeCategory.id.toString() === catId.toString()
        );
        if (attrCat) {
          const attr = attrCat.attributeCategory.attributes.find(
            (a: any) => a.id === attrId
          );
          if (attr) {
            attrPrice += attr.price ?? 0;
          }
        }
      }
    }

    // Add price for multi-selected attributes
    for (const catId in this.selectedAttributesMulti) {
      const selectedIds = this.selectedAttributesMulti[catId] || [];
      if (selectedIds.length) {
        const attrCat = this.selectedProduct.productAttributeCategories.find(
          (c: any) => c.attributeCategory.id.toString() === catId.toString()
        );
        if (attrCat) {
          selectedIds.forEach((selId: any) => {
            const attr = attrCat.attributeCategory.attributes.find(
              (a: any) => a.id === selId
            );
            if (attr) {
              attrPrice += attr.price ?? 0;
            }
          });
        }
      }
    }

    const quantity = this.productQuantities[this.selectedProduct.id] || 1;

    return (basePrice + attrPrice) * quantity;
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

  private attributesEqual(
    a: Array<{ id: number }>,
    b: Array<{ id: number }>
  ): boolean {
    if (a.length !== b.length) return false;

    const sortedA = [...a].sort((x, y) => x.id - y.id);
    const sortedB = [...b].sort((x, y) => x.id - y.id);

    for (let i = 0; i < sortedA.length; i++) {
      if (sortedA[i].id !== sortedB[i].id) {
        return false;
      }
    }
    return true;
  }

  addToCart(product: any) {
    const qty = this.getQuantity(product);

    const productAttributes: {
      id: number;
      price: number;
      attribute: { id: number; label: string };
    }[] = [];

    // Single select attributes
    for (const catId in this.selectedAttributes) {
      const attrId = this.selectedAttributes[catId];
      if (attrId) {
        const attrCat = this.selectedProduct.productAttributeCategories.find(
          (cat: any) => cat.attributeCategory.id.toString() === catId.toString()
        );
        if (attrCat) {
          const attrInstance = attrCat.attributeCategory.attributes.find(
            (a: any) => a.id === attrId
          );
          if (attrInstance) {
            productAttributes.push({
              id: attrInstance.id,
              price: attrInstance.price ?? 0,
              attribute: {
                id: attrInstance.attribute.id,
                label: attrInstance.attribute.label,
              },
            });
          }
        }
      }
    }

    // Multi select attributes
    for (const catId in this.selectedAttributesMulti) {
      const selectedIds = this.selectedAttributesMulti[catId] || [];
      const attrCat = this.selectedProduct.productAttributeCategories.find(
        (cat: any) => cat.attributeCategory.id.toString() === catId.toString()
      );
      if (attrCat) {
        selectedIds.forEach((attrId) => {
          const attrInstance = attrCat.attributeCategory.attributes.find(
            (a: any) => a.id === attrId
          );
          if (attrInstance) {
            productAttributes.push({
              id: attrInstance.id,
              price: attrInstance.price ?? 0,
              attribute: {
                id: attrInstance.attribute.id,
                label: attrInstance.attribute.label,
              },
            });
          }
        });
      }
    }

    // Check if cart already has this product with same attribute combination
    const existing = this.cart.find((item) => {
      if (item.id !== product.id) return false;
      return this.attributesEqual(
        item.productAttributes || [],
        productAttributes
      );
    });

    if (existing) {
      existing.quantity += qty;
      if (this.productNote) {
        existing.notes = (existing.notes || "") + "\n" + this.productNote;
      }
    } else {
      this.cart.push({
        ...product,
        quantity: qty,
        notes: this.productNote || "",
        productAttributes: productAttributes,
      });
    }

    this.productNote = "";
    this.productQuantities[product.id] = 1;
    this.selectedAttributes = {};
    this.selectedAttributesMulti = {};
  }

  removeFromCart(itemToRemove: any) {
    this.cart = this.cart.filter((cartItem) => {
      // Keep items that are NOT the one to remove

      // Different product ID? Keep it.
      if (cartItem.id !== itemToRemove.id) {
        return true;
      }

      // Same product ID — check attributes equality:
      return !this.attributesEqual(
        cartItem.productAttributes || [],
        itemToRemove.productAttributes || []
      );
    });
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

  getItemTotal(item: any): number {
    let attrPrice = 0;

    if (item.productAttributes?.length) {
      for (const attr of item.productAttributes) {
        attrPrice += attr.price ?? 0;
      }
    }

    return (item.price + attrPrice) * (item.quantity || 1);
  }

  getCartTotal(): number {
    return this.cart.reduce((total, item) => {
      let attrPrice = 0;

      if (item.productAttributes && item.productAttributes.length > 0) {
        // Attribute price inclusion assumes prices stored in productAttributes,
        // adjust if you want to fetch prices differently
        item.productAttributes.forEach((attr: any) => {
          attrPrice += attr.price ?? 0;
        });
      }

      return total + (item.quantity || 1) * (item.price + attrPrice);
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

  async toggleCartView() {
    if (this.view === "cart") {
      // Going back from cart to products/categories
      if (this.breadcrumb.length > 0) {
        await this.loadCategoryById(
          this.breadcrumb[this.breadcrumb.length - 1].id
        );
      } else {
        await this.loadRootCategories();
      }
    } else {
      // Going to cart — check if cart is empty
      if (this.cart.length === 0) {
        const toast = await this.toastCtrl.create({
          message: "Cart is empty",
          duration: 2000,
          position: "top",
          color: "warning",
        });
        await toast.present();
        return; // prevent switching to cart view
      }
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
        notes: item.notes || "",
        productAttributes: item.productAttributes || [],
      })),
    };

    try {
      this.loading = true;
      const res = await firstValueFrom(this.dataService.createOrder(payload));
      this.loading = false;

      const alert = await this.alertCtrl.create({
        header: "Success",
        message: "Order has been created successfully.",
        backdropDismiss: false,
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

  onAttributeChange() {
    // Optional: put logic here if needed when attribute selection changes
    // For now, you can leave it empty or add a console log
    console.log(
      "Attribute selection changed",
      this.selectedAttributes,
      this.selectedAttributesMulti
    );
  }

  toggleMultiAttribute(categoryId: number, attrId: number, checked: boolean) {
    if (!this.selectedAttributesMulti[categoryId]) {
      this.selectedAttributesMulti[categoryId] = [];
    }
    const index = this.selectedAttributesMulti[categoryId].indexOf(attrId);

    if (checked && index === -1) {
      this.selectedAttributesMulti[categoryId].push(attrId);
    } else if (!checked && index > -1) {
      this.selectedAttributesMulti[categoryId].splice(index, 1);
    }
  }

  get allAttributesSelected(): boolean {
    if (!this.selectedProduct?.productAttributeCategories) {
      return true;
    }

    for (const cat of this.selectedProduct.productAttributeCategories) {
      const catId = cat.attributeCategory.id;
      const isRequired = cat.attributeCategory.attributes.some(
        (a: any) => a.default === true
      );

      if (!isRequired) continue; // optional, can be skipped

      if (cat.attributeCategory.selectedValueType === "single") {
        if (!this.selectedAttributes[catId]) return false;
      } else {
        const selected = this.selectedAttributesMulti[catId];
        if (!selected || selected.length === 0) return false;
      }
    }

    return true;
  }

  isAttributeCategoryRequired(cat: any): boolean {
    return cat.attributeCategory.attributes.some((attr: any) => attr.default);
  }
}
