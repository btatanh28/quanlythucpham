import { Component, OnInit } from '@angular/core';
import { SanPhamService, SanPham } from '../services/productService';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  imports: [NgFor, FormsModule, CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  products: SanPham[] = []; 
  filteredProducts: SanPham[] = []; 
  searchQuery: string = ''; 

  constructor(private sanPhamService: SanPhamService) {}

  ngOnInit(): void {
    this.loadProducts(); 
  }

  // Tải tất cả sản phẩm từ API
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
    console.log(`Đã thêm ${product.TenSanPham} vào giỏ hàng`);
    alert(`${product.TenSanPham} đã được thêm vào giỏ hàng!`);
  }
}