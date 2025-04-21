import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../services/cartService';
import { SanPham } from '../services/productService';
import { OrderService } from '../services/orderService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/authService';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

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

  private currentUserSubscription!: Subscription;

  constructor(
    private cartService: CartService,
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

  confirmCheckout(): void {
    if (!this.tenKhachHang) {
      alert('Bạn cần đăng nhập trước khi đặt hàng!');
      this.router.navigate(['/login']);
      return;
    }

    const chiTiet = this.cartItems
      .filter(item => item.product.IDSanPham)
      .map(item => ({
        IDSanPham: item.product.IDSanPham as string,
        Quantity: item.quantity,
        Gia: item.product.Gia
      }));

    const donHang = {
      TenKhachHang: this.tenKhachHang,
      chiTiet
    };

    this.orderService.createOrder(donHang).subscribe({
      next: (res) => {
        console.log('Đơn hàng đã tạo:', res);
        this.orderService.getOrderById(res.IDDonHang).subscribe({
          next: (orderDetail) => {
            console.log('Chi tiết đơn hàng:', orderDetail);
            alert('Đặt hàng thành công!\nMã đơn hàng: ' + res.IDDonHang);
            this.cartService.clearCart();
            this.closeModal();
          },
          error: (err) => {
            console.error('Lỗi khi lấy chi tiết đơn hàng', err);
            alert('Lỗi khi lấy chi tiết đơn hàng!');
          }
        });
      },
      error: (err) => {
        console.error('Lỗi khi đặt hàng', err);
        alert('Lỗi khi đặt hàng!');
      }
    });
  }
}