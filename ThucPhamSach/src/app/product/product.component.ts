// src/app/product.component.ts
import { Component, OnInit } from '@angular/core';
import { SanPhamService, SanPham } from '../services/productService';
import { CartComponent } from '../cart/cart.component';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cartService';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [NgFor, FormsModule, CommonModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: SanPham[] = [];
  filteredProducts: SanPham[] = [];
  searchQuery: string = '';

  constructor(
    private sanPhamService: SanPhamService,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.sanPhamService.getSanPhams().subscribe({
      next: (data: SanPham[]) => {
        this.products = data;
        this.filteredProducts = data;
      },
      error: (error) => {
        console.error('Lỗi khi lấy sản phẩm:', error);
        alert('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
      }
    });
  }

  onSearch(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (query) {
      this.filteredProducts = this.products.filter(product =>
        product.TenSanPham.toLowerCase().includes(query)
      );
    } else {
      this.filteredProducts = this.products;
    }
  }

  addToCart(product: SanPham): void {
    this.cartService.addToCart(product);
  }
}