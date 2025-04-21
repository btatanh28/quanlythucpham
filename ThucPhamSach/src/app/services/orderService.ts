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
}

// Cập nhật interface Order để phù hợp với TenKhachHang
interface CartItem {
  product: { id: number; name: string; price: number; image: string };
  quantity: number;
}

interface Order {
  id: number;
  customer: string; // Đảm bảo customer là TenKhachHang (kiểu string)
  items: CartItem[];
  total: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5000/api/donhang';

  constructor(private http: HttpClient) {}

  createOrder(orderData: DonHang): Observable<any> {
    return this.http.post<any>(this.apiUrl, orderData);
  }

  getOrderById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  updateTrangThai(id: number, data: { TrangThaiSanPham: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/trangthai`, data);
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}