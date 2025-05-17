import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { ModalController } from "@ionic/angular/standalone";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/angular/standalone";
@Component({
  selector: "app-add-order-modal",
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Add Order</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="close()">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Simple navigation between pages -->
      <ng-container [ngSwitch]="page">
        <div *ngSwitchCase="'categories'">
          <ion-list>
            <ion-item
              button
              *ngFor="let cat of categories"
              (click)="goToSubcategories(cat)"
            >
              {{ cat.name }}
            </ion-item>
          </ion-list>
        </div>

        <div *ngSwitchCase="'subcategories'">
          <ion-button fill="clear" (click)="page = 'categories'"
            >Back to Categories</ion-button
          >
          <ion-list>
            <ion-item
              button
              *ngFor="let sub of selectedCategory.subcategories"
              (click)="goToProducts(sub)"
            >
              {{ sub.name }}
            </ion-item>
          </ion-list>
        </div>

        <div *ngSwitchCase="'products'">
          <ion-button fill="clear" (click)="page = 'subcategories'"
            >Back to Subcategories</ion-button
          >
          <ion-list>
            <ion-item *ngFor="let product of selectedSubcategory.products">
              {{ product.name }}
              <ion-button slot="end" (click)="addToCart(product)"
                >Add</ion-button
              >
            </ion-item>
          </ion-list>
        </div>
      </ng-container>
    </ion-content>
  `,
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
  ],
})
export class AddOrderModalComponent {
  page: "categories" | "subcategories" | "products" = "categories";

  categories = [
    {
      name: "Drinks",
      subcategories: [
        {
          name: "Soft Drinks",
          products: [{ name: "Coke" }, { name: "Pepsi" }],
        },
        {
          name: "Alcohol",
          products: [{ name: "Beer" }, { name: "Wine" }],
        },
      ],
    },
    {
      name: "Food",
      subcategories: [
        {
          name: "Starters",
          products: [{ name: "Fries" }, { name: "Salad" }],
        },
        {
          name: "Main Course",
          products: [{ name: "Burger" }, { name: "Steak" }],
        },
      ],
    },
  ];

  selectedCategory: any = null;
  selectedSubcategory: any = null;

  constructor() {}
  private modalCtrl: ModalController = inject(ModalController);

  close() {
    this.modalCtrl.dismiss();
  }

  goToSubcategories(cat: any) {
    this.selectedCategory = cat;
    this.page = "subcategories";
  }

  goToProducts(sub: any) {
    this.selectedSubcategory = sub;
    this.page = "products";
  }

  addToCart(product: any) {
    console.log("Add to cart:", product);
    // Implement adding to cart logic here
  }
}
