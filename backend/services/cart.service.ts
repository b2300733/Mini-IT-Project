import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  userAvatar: string;
  userName: string;
  productImg: string;
  productName: string;
  condition: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  addToCart(item: CartItem) {
    const currentItems = this.cartItems.value;
    this.cartItems.next([...currentItems, item]);
  }

  removeFromCart(index: number) {
    const currentItems = [...this.cartItems.value];
    currentItems.splice(index, 1);
    this.cartItems.next(currentItems);
  }

  clearCart() {
    this.cartItems.next([]);
  }

  getTotalAmount(): number {
    return this.cartItems.value.reduce((total, item) => total + item.price, 0);
  }
}