import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Services/api.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cart: any = { products: [], totalPrice: 0 };
  userId: number = 1; // Example user ID

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.apiService.getCart(this.userId).subscribe((data) => {
      this.cart = data;
    });
  }

  removeFromCart(productId: number): void {
    this.apiService.removeFromCart(this.userId, productId).subscribe(() => {
      this.loadCart();
    });
  }
}
