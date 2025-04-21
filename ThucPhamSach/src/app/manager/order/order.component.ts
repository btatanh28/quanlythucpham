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
  styleUrls: ['./order.component.css']
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    // Sửa lỗi typo ở đây
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        // Chuyển đổi dữ liệu từ API về đúng dạng để hiển thị
        this.orders = orders.map(order => ({
          id: order.id,
          customer: order.customer,
          total: order.total,
          status: order.status,
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
    this.orderService.updateTrangThai(order.id, { TrangThaiSanPham: order.status }).subscribe({
      next: (res) => {
        alert(`Cập nhật trạng thái thành công`)
        // console.log('Cập nhật trạng thái thành công:', res);
      },
      error: (err) => {
        console.error('Lỗi khi cập nhật trạng thái', err);
        alert('Lỗi khi cập nhật trạng thái!');
      }
    });
  }

  deleteOrder(id: number): void {
    if (confirm('Bạn có chắc muốn xóa đơn hàng này?')) {
      this.orderService.deleteOrder(id).subscribe({
        next: (res) => {
          console.log('Xóa đơn hàng thành công:', res);
          this.orders = this.orders.filter(order => order.id !== id); // Cập nhật lại danh sách sau khi xóa
        },
        error: (err) => {
          console.error('Lỗi khi xóa đơn hàng', err);
          alert('Lỗi khi xóa đơn hàng!');
        }
      });
    }
  }
}
