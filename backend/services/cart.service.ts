import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface CartItem {
  productImg: string;
  productTitle: string;
  quantity: number;
  price: number;
  productId?: string;
  shopProductId?: string;
}

export interface CheckoutHistory {
  items: CartItem[];
  totalAmount: number;
  purchaseDate: Date;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private baseUrl = 'http://localhost:3000/api/cart';
  private userEmail: string | null = null;

  constructor(private http: HttpClient) {
    // Check both storage locations for user email
    this.userEmail =
      localStorage.getItem('email') || sessionStorage.getItem('email');
    this.loadCart();
  }

  setUserEmail(email: string) {
    this.userEmail = email;
    this.loadCart();
  }

  clearUserEmail() {
    this.userEmail = null;
    this.cartItems.next([]);
  }

  private loadCart() {
    if (this.userEmail) {
      this.http
        .get<{ cart: CartItem[] }>(
          `${this.baseUrl}/${encodeURIComponent(this.userEmail)}`
        )
        .pipe(map((response) => response.cart))
        .subscribe(
          (cart) => this.cartItems.next(cart || []),
          (error) => console.error('Error loading cart:', error)
        );
    } else {
      this.cartItems.next([]);
    }
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  addToCart(item: CartItem) {
    const currentItems = this.cartItems.value;
    const updatedItems = [...currentItems, item];

    if (this.userEmail) {
      this.http
        .post(`${this.baseUrl}/${encodeURIComponent(this.userEmail)}/add`, item)
        .subscribe(
          () => this.cartItems.next(updatedItems),
          (error) => console.error('Error adding item to cart:', error)
        );
    } else {
      this.cartItems.next(updatedItems);
    }
  }

  removeFromCart(index: number) {
    const currentItems = [...this.cartItems.value];
    currentItems.splice(index, 1);

    if (this.userEmail) {
      this.http
        .delete(
          `${this.baseUrl}/${encodeURIComponent(this.userEmail)}/item/${index}`
        )
        .subscribe(
          () => this.cartItems.next(currentItems),
          (error) => console.error('Error removing item from cart:', error)
        );
    } else {
      this.cartItems.next(currentItems);
    }
  }

  updateCart(items: CartItem[]) {
    if (this.userEmail) {
      this.http
        .put(`${this.baseUrl}/${encodeURIComponent(this.userEmail)}`, {
          cart: items,
        })
        .subscribe(
          () => this.cartItems.next(items),
          (error) => console.error('Error updating cart:', error)
        );
    } else {
      this.cartItems.next(items);
    }
  }

  clearCart() {
    if (this.userEmail) {
      this.http
        .delete(`${this.baseUrl}/${encodeURIComponent(this.userEmail)}`)
        .subscribe(
          () => this.cartItems.next([]),
          (error) => console.error('Error clearing cart:', error)
        );
    } else {
      this.cartItems.next([]);
    }
  }

  getTotalAmount(): number {
    return this.cartItems.value.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  checkout(userDetails?: {
    email: string;
    contactNo: string;
    address: string;
  }): Observable<{
    message: string;
    history: CheckoutHistory;
    failedItems: any[];
  }> {
    if (this.userEmail) {
      return this.http
        .post<{
          message: string;
          history: CheckoutHistory;
          failedItems: any[];
        }>(`${this.baseUrl}/${encodeURIComponent(this.userEmail)}/checkout`, {
          userDetails,
        })
        .pipe(
          map((response) => {
            // Refresh the cart after checkout
            this.loadCart();
            return response;
          })
        );
    }

    throw new Error('User not logged in');
  }
}
