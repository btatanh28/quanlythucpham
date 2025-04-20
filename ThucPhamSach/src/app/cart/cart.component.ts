import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [
    // Dữ liệu mẫu, có thể thay bằng dữ liệu từ service
    { product: { id: 1, name: 'Bánh Mỳ', price: 25000, image: 'assets/banhmi.jpg' }, quantity: 2 },
    { product: { id: 2, name: 'Bún bò Huế', price: 35000, image: 'assets/bunbohue.jpg' }, quantity: 1 }
  ];

  ngOnInit() {}

  updateQuantity(item: CartItem) {
    if (item.quantity < 1) {
      item.quantity = 1; 
    }
  }

  removeFromCart(item: CartItem) {
    this.cartItems = this.cartItems.filter(i => i !== item);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  checkout() {
    alert('Chuyển đến trang thanh toán!'); 
  }
}