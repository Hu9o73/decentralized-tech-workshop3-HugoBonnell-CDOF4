import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { NgForm } from '@angular/forms';
import { Product } from '../../Models/product.model';

declare var $: any; // Declare jQuery

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  userId: number = 1; // Example user ID

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getProducts().subscribe((data: Product[]) => {
      this.products = data.map((product: Product) => ({ ...product, quantity: 1 }));
    });
  }

  createProduct(form: NgForm): void {
    if (form.valid) {
      this.apiService.createProduct(form.value).subscribe((data: Product) => {
        this.products.push({ ...data, quantity: 1 });
        form.reset();
        $('#createProductModal').modal('hide');
      });
    }
  }

  addToCart(productId: number, quantity: number): void {
    const validQuantity = quantity ?? 1; // Use nullish coalescing to provide a default value
    if (validQuantity > 0) {
      this.apiService.addToCart(this.userId, { productId, quantity: validQuantity }).subscribe(() => {
        alert('Product added to cart!');
      });
    } else {
      alert('Quantity must be greater than zero.');
    }
  }
}