import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/orderService';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CartItem {
  product: { id: number; name: string; price: number; image: string };
  quantity: number;
}

interface Order {
  id: number;
  customer: string;
  items: CartItem[];
  total: number;
  status: string;
}

@Component({
  selector: 'app-admin-orders',
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orders = this.orderService.getOrders();
  }

  updateOrderStatus(order: Order) {
    this.orderService.updateOrder(order);
  }

  deleteOrder(id: number) {
    if (confirm('Bạn có chắc muốn xóa đơn hàng này?')) {
      this.orderService.deleteOrder(id);
      this.orders = this.orderService.getOrders();
    }
  }
}