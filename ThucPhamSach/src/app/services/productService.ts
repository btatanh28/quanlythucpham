import { Injectable } from '@angular/core';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    { id: 1, name: 'Rau Cải Xanh', price: 25000, image: 'assets/images/rau-cai-xanh.jpg' },
    { id: 2, name: 'Cà Chua Organic', price: 35000, image: 'assets/images/ca-chua.jpg' }
  ];

  getProducts(): Product[] {
    return this.products;
  }

  addProduct(product: Product) {
    this.products.push(product);
  }

  updateProduct(product: Product) {
    const index = this.products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this.products[index] = product;
    }
  }

  deleteProduct(id: number) {
    this.products = this.products.filter(p => p.id !== id);
  }
}