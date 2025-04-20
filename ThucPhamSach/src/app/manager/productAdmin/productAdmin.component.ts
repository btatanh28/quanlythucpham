import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/productService';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-admin-products',
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './productAdmin.component.html',
  styleUrl: './productAdmin.component.css'
})
export class ProductAdminComponent implements OnInit {
  products: Product[] = [];
  newProduct: Product = { id: 0, name: '', price: 0, image: '' };
  editingProduct: Product | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.products = this.productService.getProducts();
  }

  saveProduct() {
    if (this.newProduct.name && this.newProduct.price > 0 && this.newProduct.image) {
      if (this.editingProduct) {
        this.productService.updateProduct({ ...this.newProduct, id: this.editingProduct.id });
      } else {
        this.productService.addProduct({ ...this.newProduct, id: this.products.length + 1 });
      }
      this.products = this.productService.getProducts();
      this.resetForm();
    }
  }

  editProduct(product: Product) {
    this.newProduct = { ...product };
    this.editingProduct = product;
  }

  deleteProduct(id: number) {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      this.productService.deleteProduct(id);
      this.products = this.productService.getProducts();
    }
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {
    this.newProduct = { id: 0, name: '', price: 0, image: '' };
    this.editingProduct = null;
  }
}