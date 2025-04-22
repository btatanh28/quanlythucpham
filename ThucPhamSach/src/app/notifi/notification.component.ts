import { Component, OnInit } from '@angular/core';
import { OrderService, Order } from '../services/orderService';
import { AuthService } from '../services/authService';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [NgIf,  CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit {
  orders: Order[] = [];
  selectedOrder: Order | null = null;
  isLoading = false;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      this.fetchOrders(userId.toString()); // Chuyển đổi userId sang kiểu string
    }
  }
  
  fetchOrders(id: string) {
    this.isLoading = true;
    this.orderService.getOrdersByCustomerId(id).subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi khi lấy đơn hàng:', err);
        this.isLoading = false;
      }
    });
  }

  viewOrderDetail(orderId: number) {
    this.isLoading = true;
    this.orderService.getOrderById(orderId).subscribe({
      next: (order) => {
        this.selectedOrder = order;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi khi lấy chi tiết đơn hàng:', err);
        this.isLoading = false;
      }
    });
  }
}
