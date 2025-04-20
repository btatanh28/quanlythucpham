import { Injectable } from '@angular/core';

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

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Order[] = [
    {
      id: 1,
      customer: 'Nguyễn Văn A',
      items: [
        { product: { id: 1, name: 'Rau Cải Xanh', price: 25000, image: 'assets/images/rau-cai-xanh.jpg' }, quantity: 2 }
      ],
      total: 50000,
      status: 'Pending'
    }
  ];

  getOrders(): Order[] {
    return this.orders;
  }

  updateOrder(order: Order) {
    const index = this.orders.findIndex(o => o.id === order.id);
    if (index !== -1) {
      this.orders[index] = order;
    }
  }

  deleteOrder(id: number) {
    this.orders = this.orders.filter(o => o.id !== id);
  }

  addOrder(order: Order) {
    this.orders.push(order);
  }
}