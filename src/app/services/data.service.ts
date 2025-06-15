import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class DataService {
  private apiUrl = "https://florder.gr:3100";

  constructor(private http: HttpClient) {}

  getUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/user`);
  }

  // Tables
  getTables(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      sortBy?: string;
      sortingOrder?: string;
    } = {}
  ): Observable<any> {
    return this.http.get(`${this.apiUrl}/tables`, { params });
  }

  getTablesArray(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/tables/find-all-selecting-id-and-label`
    );
  }

  getTableOrders(tableId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/tables/${tableId}/orders`);
  }

  // Orders
  createOrder(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders`, payload);
  }

  getOrder(orderId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders/${orderId}`);
  }

  cancelOrder(orderId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/orders/${orderId}/cancel`, {});
  }

  updatePaidStatus(payload: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/orders/update-paid-status`, payload);
  }

  updateOrdersTable(payload: any): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/orders/update-orders-table`,
      payload
    );
  }

  // Categories & Products
  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories`);
  }

  getSubcategories(categoryId: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/categories/${categoryId}/subcategories`
    );
  }

  getCategoryProducts(categoryId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories/${categoryId}/products`);
  }

  getProduct(productId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/${productId}`);
  }

  // Payment Methods
  getPaymentMethods(): Observable<any> {
    return this.http.get(`${this.apiUrl}/payment-methods`);
  }

  // Order Products
  getOrderProduct(orderProductId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders-products/${orderProductId}`);
  }
}
