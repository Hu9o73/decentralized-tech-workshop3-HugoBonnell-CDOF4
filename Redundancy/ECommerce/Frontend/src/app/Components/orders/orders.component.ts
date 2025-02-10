import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { NgForm } from '@angular/forms';

declare var $: any; // Declare jQuery

interface OrderProduct {
  productId: number;
  quantity: number;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  userId: number = 1; // Example user ID
  orderProducts: OrderProduct[] = [{ productId: 0, quantity: 1 }];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getOrders(this.userId).subscribe((data) => {
      this.orders = data;
    });
  }

  createOrder(form: NgForm): void {
    if (form.valid) {
      const orderData = {
        userId: form.value.userId,
        products: this.orderProducts,
      };
      this.apiService.createOrder(orderData).subscribe((data) => {
        this.orders.push(data);
        form.reset();
        this.orderProducts = [{ productId: 0, quantity: 1 }];
        $('#createOrderModal').modal('hide');
      });
    }
  }

  addProduct(): void {
    this.orderProducts.push({ productId: 0, quantity: 1 });
  }

  removeProduct(index: number): void {
    this.orderProducts.splice(index, 1);
  }
}
