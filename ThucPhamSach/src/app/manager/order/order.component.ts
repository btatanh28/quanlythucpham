import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/orderService';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CartItem {
  product: { id: number; name: string; price: number; image: string };
  quantity: number;
}

interface Order {
  id: number;
  customer: string;
  address: string;
  phone: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  status: string;
}

@Component({
  selector: 'app-admin-orders',
  imports: [NgFor, NgIf, FormsModule, CommonModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        // Kiểm tra dữ liệu nhận được từ API
        this.orders = orders.map(order => ({
          id: order.id,
          customer: order.customer,
          address: order.address,
          phone: order.phone,
          total: order.total,
          status: order.status,
          paymentMethod: order.paymentMethod,  // Kiểm tra phương thức thanh toán
          items: order.items || [] // Đảm bảo luôn có mảng items
        }));
      },
      error: (err) => {
        console.error('Lỗi khi lấy đơn hàng', err);
        alert('Lỗi khi lấy danh sách đơn hàng!');
      }
    });
  }

  updateOrderStatus(order: Order): void {
    // Kiểm tra nếu trạng thái thực sự thay đổi mới cập nhật
    if (order.status) {
      this.orderService.updateTrangThai(order.id, { TrangThaiSanPham: order.status }).subscribe({
        next: (res) => {
          alert('Cập nhật trạng thái thành công');
        },
        error: (err) => {
          console.error('Lỗi khi cập nhật trạng thái', err);
          alert('Lỗi khi cập nhật trạng thái!');
        }
      });
    }
  }

  deleteOrder(id: number): void {
    // Hiển thị thông báo xác nhận xóa đơn hàng
    const confirmation = window.confirm('Bạn có chắc muốn xóa đơn hàng này?');
    if (confirmation) {
      this.orderService.deleteOrder(id).subscribe({
        next: (res) => {
          console.log('Xóa đơn hàng thành công:', res);
          this.orders = this.orders.filter(order => order.id !== id); // Cập nhật lại danh sách
        },
        error: (err) => {
          console.error('Lỗi khi xóa đơn hàng', err);
          alert('Lỗi khi xóa đơn hàng!');
        }
      });
    }
  }
}
