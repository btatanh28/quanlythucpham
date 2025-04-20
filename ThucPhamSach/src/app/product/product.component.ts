import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'


interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-products',
  imports: [NgFor, FormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  products: Product[] = [
    { id: 1, name: 'Bánh Mỳ', price: 25000, image: 'assets/banhmi.jpg' },
    { id: 2, name: 'Bún bò Huế', price: 35000, image: 'assets/bunbohue.jpg' },
    { id: 3, name: 'Bún chả', price: 60000, image: 'assets/buncha.jpg' },
    { id: 4, name: 'Chả giò', price: 20000, image: 'assets/chagio.jpg' },
    { id: 5, name: 'Cơm gà', price: 30000, image: 'assets/comga.jpg' },
    { id: 6, name: 'Cơm tấm', price: 22000, image: 'assets/comtam.jpg' }
  ];
  searchQuery: string = '';
  filteredProducts: Product[] = [];

  ngOnInit() {
    this.filteredProducts = [...this.products]; // Hiển thị tất cả ban đầu
  }

  onSearch() {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(query)
      );
    }
  }

  addToCart(product: Product) {
    alert(`${product.name} đã được thêm!`); 
  }
}