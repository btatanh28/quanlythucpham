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
        this.filteredProducts = data.map((sp) => ({
          ...sp,
          trangThai: sp.SoTonKho === 0 ? 'Hết hàng' : 'Còn hàng'
        }));
      },
      error: (error) => {
        console.error('Lỗi khi lấy sản phẩm:', error);
        alert('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
      }
    });
    
    // this.sanPhamService.getSanPhamById(id).subscribe({
    //   next: (sp: SanPham) => {
    //     if (sp.SoTonKho === 0) {
    //       alert('Sản phẩm này đã hết hàng!');
    //     }
    //     console.log('Chi tiết sản phẩm:', sp);
    //   },
    //   error: (err) => {
    //     console.error('Lỗi khi lấy sản phẩm:', err);
    //   }
    // });
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
    if (!product.IDSanPham) {
      alert('Không tìm thấy ID sản phẩm. Không thể thêm vào giỏ hàng.');
      return;
    }
    
    this.sanPhamService.kiemTraTonKho(product.IDSanPham).subscribe({
      next: (tonKho) => {
        if (tonKho === 0) {
          alert('Sản phẩm này đã hết hàng!');
          return;
        }
  
        // Tiếp tục thêm vào giỏ hàng
        this.cartService.addToCart(product);
        console.log('Thêm vào giỏ hàng:', product);
      },
      error: (err) => {
        console.error('Lỗi kiểm tra tồn kho:', err);
        alert('Không thể kiểm tra tồn kho. Vui lòng thử lại.');
      }
    });
  }
}