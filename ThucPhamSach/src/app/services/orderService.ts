import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ChiTietDonHang {
  IDSanPham: string;
  Quantity: number;
  Gia: number;
}

export interface DonHang {
  TenKhachHang: string;
  chiTiet: ChiTietDonHang[];
  TrangThaiSanPham?: string;
  HinhThucThanhToan?: string;
}

// Cập nhật interface Order để phù hợp với TenKhachHang
interface CartItem {
  product: { id: number; name: string; price: number; image: string };
  quantity: number;
}

export interface Order {
  id: number;
  customer: string;
  address: string;  // Đảm bảo có các thuộc tính này
  phone: string;
  items: CartItem[];
  total: number;  
  paymentMethod: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5000/api/donhang'; // Đảm bảo URL API đúng

  constructor(private http: HttpClient) {}

  // Tạo đơn hàng
  createOrder(orderData: DonHang): Observable<any> {
    return this.http.post<any>(this.apiUrl, orderData);
  }

  // Lấy danh sách đơn hàng của khách hàng
  getOrdersByCustomerId(customerId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/customer/${customerId}`);
  }

  // Lấy thông tin đơn hàng theo ID
  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  // Lấy tất cả đơn hàng (dành cho admin)
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Cập nhật trạng thái đơn hàng
  updateTrangThai(id: number, data: { TrangThaiSanPham: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/trangthai`, data);
  }

  // Xóa đơn hàng
  deleteOrder(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
