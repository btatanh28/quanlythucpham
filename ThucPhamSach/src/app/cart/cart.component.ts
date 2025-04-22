import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../services/cartService';
import { SanPham } from '../services/productService';
import { OrderService } from '../services/orderService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/authService';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SanPhamService } from '../services/productService';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: { product: SanPham; quantity: number }[] = [];
  isModalOpen: boolean = false;
  tenKhachHang: string | null = null;
  selectedPaymentMethod: string = 'cash'; // Mặc định là thanh toán khi nhận hàng
  sanPhamHopLe: { product: SanPham; quantity: number }[] = [];
  daKiemTraTonKho: boolean = false;

  private currentUserSubscription!: Subscription;

  constructor(
    private cartService: CartService,
    private sanPhamService: SanPhamService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  ngOnInit(): void {
    // Lấy TenKhachHang ngay khi khởi tạo
    this.tenKhachHang = this.authService.getUserCurrent();

    // Lắng nghe sự thay đổi của currentUser$
    this.currentUserSubscription = this.authService.currentUser$.subscribe(user => {
      this.tenKhachHang = user ? user.TenKhachHang : null;
      console.log('TenKhachHang updated:', this.tenKhachHang);
    });
  }

  ngOnDestroy(): void {
    // Hủy subscription để tránh rò rỉ bộ nhớ
    if (this.currentUserSubscription) {
      this.currentUserSubscription.unsubscribe();
    }
  }

  updateQuantity(item: { product: SanPham; quantity: number }): void {
    this.cartService.updateQuantity(item.product.IDSanPham!, item.quantity);
  }

  removeFromCart(item: { product: SanPham; quantity: number }): void {
    this.cartService.removeFromCart(item.product.IDSanPham!);
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  openCheckoutModal(): void {
    if (!this.tenKhachHang) {
      alert('Bạn cần đăng nhập trước khi thanh toán!');
      this.router.navigate(['/login']);
      return;
    }
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  handleCheckout(cartItems: { product: SanPham; quantity: number }[]): void {
    if (!this.tenKhachHang) {
      alert('Bạn cần đăng nhập trước khi đặt hàng!');
      this.router.navigate(['/login']);
      return;
    }
  
    if (!this.daKiemTraTonKho) {
      // Bước 1: Kiểm tra tồn kho
      this.sanPhamHopLe = [];
      let soLuongDaKiemTra = 0;
  
      for (let item of cartItems) {
        if (!item.product.IDSanPham) continue;
  
        this.sanPhamService.kiemTraTonKho(item.product.IDSanPham).subscribe({
          next: (tonKho) => {
            soLuongDaKiemTra++;
            if (tonKho === 0) {
              alert(`Sản phẩm "${item.product.TenSanPham}" đã hết hàng!`);
            } else {
              this.sanPhamHopLe.push(item);
            }
  
            if (soLuongDaKiemTra === cartItems.length) {
              if (this.sanPhamHopLe.length > 0) {
                this.daKiemTraTonKho = true;
                alert('Sản phẩm còn hàng! Bấm lại nút để xác nhận đặt hàng.');
              } else {
                alert('Tất cả sản phẩm đều đã hết hàng.');
              }
            }
          },
          error: () => {
            soLuongDaKiemTra++;
            alert('Lỗi kiểm tra tồn kho!');
          }
        });
      }
    } else {
      // Bước 2: Tạo đơn hàng duy nhất cho tất cả sản phẩm hợp lệ
      const chiTiet = this.sanPhamHopLe.map(item => ({
        IDSanPham: item.product.IDSanPham!,
        Quantity: item.quantity,
        Gia: item.product.Gia
      }));
  
      const donHang = {
        TenKhachHang: this.tenKhachHang!,
        chiTiet,
        HinhThucThanhToan: this.selectedPaymentMethod === 'cash' ? 'Thanh toán khi nhận hàng' : 'Thanh toán chuyển khoản' // Chuyển đổi phương thức thanh toán
      };
  
      this.orderService.createOrder(donHang).subscribe({
        next: (res) => {
          console.log('Đơn hàng đã được tạo:', res);

          alert(`✅ Đặt hàng thành công!\nMã đơn: ${res.IDDonHang}`);
          this.cartService.clearCart();
        },
        error: () => {
          alert('❌ Lỗi khi đặt hàng!');
        }
      });
  
      // Reset lại trạng thái
      this.daKiemTraTonKho = false;
      this.sanPhamHopLe = [];
    }
  }
  
}
