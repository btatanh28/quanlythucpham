import { Injectable } from '@angular/core';
import { SanPham } from './productService';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from './authService';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: { product: SanPham; quantity: number }[] = [];
  private cartItemsSubject = new BehaviorSubject<{ product: SanPham; quantity: number }[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
  private userSubscription: Subscription;

  constructor(private authService: AuthService) {
    // Tải giỏ hàng ban đầu
    // this.loadCart();

    // Lắng nghe sự thay đổi người dùng
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.loadCart(); // Tải lại giỏ hàng khi người dùng thay đổi
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private getCartKey(): string {
    const tenKhachHang = this.authService.getUserCurrent();
    return tenKhachHang ? `cartItems_${tenKhachHang}` : 'cartItems_guest';
  }

  addToCart(product: SanPham): void {
    const existingItem = this.cartItems.find(item => item.product.IDSanPham === product.IDSanPham);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }
    this.updateCart();
    alert(`${product.TenSanPham} đã được thêm vào giỏ hàng!`);
  }

  removeFromCart(productId: string): void {
    this.cartItems = this.cartItems.filter(item => item.product.IDSanPham !== productId);
    this.updateCart();
  }

  updateQuantity(productId: string, quantity: number): void {
    const item = this.cartItems.find(item => item.product.IDSanPham === productId);
    if (item && quantity >= 1) {
      item.quantity = quantity;
      this.updateCart();
    }
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.product.Gia * item.quantity, 0);
  }

  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }

  loadCart(): void {
    if (typeof window !== 'undefined' && window.localStorage) {  
      const cartKey = this.getCartKey();
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        this.cartItems = JSON.parse(savedCart);
      } else {
        this.cartItems = [];
      }
      this.cartItemsSubject.next(this.cartItems);
    } else {
      console.error('localStorage is not available in this environment');
      this.cartItems = []; 
      this.cartItemsSubject.next(this.cartItems);
    }
  }

  private updateCart(): void {
    const cartKey = this.getCartKey();
    localStorage.setItem(cartKey, JSON.stringify(this.cartItems));
    this.cartItemsSubject.next(this.cartItems);
  }
}