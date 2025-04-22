import { Injectable, Inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private currentUserSubject: BehaviorSubject<any>;
  currentUser$: Observable<any>;
  private isBrowser: boolean;
  private currentUser: { IDKhachHang: number, TenKhachHang: string } | null = null;


  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    const currentUser = this.isBrowser ? this.getUserCurrent() : null;
    this.currentUserSubject = new BehaviorSubject<any>(currentUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
    console.log('AuthService initialized, currentUser:', currentUser);
  }

  private validateInput(data: any): boolean {
    if (!data || !data.Email || !data.MatKhau) {
      throw new Error('Email và Mật khẩu không được để trống');
    }
    return true;
  }

  login(user: { Email: string; MatKhau: string }): Observable<any> {
    this.validateInput(user);
    return this.http.post(`${this.apiUrl}/login`, user).pipe(
      tap({
        next: (response: any) => {
          if (response?.token) {
            const userData = {
              IDKhachHang: response.IDKhachHang || null,
              IDUser: response.IDUser || null,
              TenKhachHang: response.TenKhachHang || response.TenNguoiDung || null,
              Email: response.Email || null,
              role: response.role,
              userType: response.userType
            };

            localStorage.setItem('Token', response.token);
            localStorage.setItem('Current', JSON.stringify(userData));
            this.currentUserSubject.next(userData);
            console.log('Đăng nhập thành công:', userData);
          } else {
            console.error('API trả về không hợp lệ:', response);
          }
        },
        error: (err) => {
          console.error('Đăng nhập thất bại:', err);
        }
      })
    );
  }
  
  register(users: {
    IDUser: string;
    TenNguoiDung: string;
    MatKhau: string;
    Email: string;
    DiaChi: string;
    SoDienThoai: string;
  }): Observable<any> {
    if (!users.IDUser || !users.TenNguoiDung || !users.MatKhau || !users.Email) {
      throw new Error('Thông tin phải được điền đầy đủ');
    }
    return this.http.post(`${this.apiUrl}/register`, users);
  }

  registerClient(customer: {
    TenKhachHang: string;
    MatKhau: string;
    Email: string;
    DiaChi: string;
    SoDienThoai: string;
  }): Observable<any> {
    if (!customer.TenKhachHang || !customer.MatKhau || !customer.Email || !customer.SoDienThoai) {
      throw new Error('Thông tin phải được điền đầy đủ');
    }
    return this.http.post(`${this.apiUrl}/registerClient`, customer, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  isAdmin(): boolean {
    if (this.isBrowser) {
      const currentUserStr = localStorage.getItem('Current');
      if (!currentUserStr || currentUserStr === 'undefined') return false;

      try {
        const currentUser = JSON.parse(currentUserStr);
        return currentUser?.role === 'Admin' || currentUser?.role === 'admin';
      } catch (error) {
        console.error('Lỗi khi parse Current user:', error);
        return false;
      }
    }
    return false;
  }


  getCustomerId(): number | null {
    const customerId = localStorage.getItem('customerId');
    return customerId ? Number(customerId) : null;
  }

  getUserId(): number | null {
    // Lấy userID từ BehaviorSubject thay vì từ localStorage trực tiếp
    const currentUser = this.currentUserSubject.value;
    return currentUser ? currentUser.IDKhachHang : null;
  }

  getUserCurrent(): any {
    if (this.isBrowser) {
      const user = localStorage.getItem('Current');
      if (user && user !== 'undefined') {
        try {
          return JSON.parse(user);
        } catch (error) {
          console.error('Error parsing Current user:', error);
          localStorage.removeItem('Current');
          return null;
        }
      }
      return null;
    }
    return null;
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem('Token') : null;
  }

  logOut(): void {
    if (this.isBrowser) {
      // localStorage.removeItem('Token');
      // localStorage.removeItem('Current');
      // localStorage.removeItem('cartItems');
      localStorage.clear();

    }
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.getUserCurrent();
  }
}