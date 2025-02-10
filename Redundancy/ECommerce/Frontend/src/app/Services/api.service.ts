// src/app/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Products
  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products`);
  }

  getProduct(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/${id}`);
  }

  createProduct(product: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/products`, product);
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}`);
  }

  // Orders
  createOrder(order: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders`, order);
  }

  getOrders(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders/${userId}`);
  }

  // Cart
  addToCart(userId: number, product: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart/${userId}`, product);
  }

  getCart(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/cart/${userId}`);
  }

  removeFromCart(userId: number, productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cart/${userId}/item/${productId}`);
  }
}
