export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    quantity?: number; // Optional quantity field for the cart
  }