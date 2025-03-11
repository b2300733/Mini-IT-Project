import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface CartItem {
  productId: string;
  productImg: string;
  productName: string;
  quantity: number;
  price: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl = 'http://localhost:3000/api/cart';
  private cartItems = new BehaviorSubject<CartItem[]>([]);

  constructor(private http: HttpClient) {}

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  fetchCart(email: string): void {
    this.http.get<{ cart: CartItem[] }>(`${this.baseUrl}/${email}`).subscribe(
      (response) => {
        this.cartItems.next(response.cart);
      },
      (error) => {
        console.error('Error fetching cart:', error);
      }
    );
  }

  addToCart(email: string, item: CartItem): void {
    this.http.post(`${this.baseUrl}/add`, { email, ...item }).subscribe(
      (response: any) => {
        this.cartItems.next(response.cart);
      },
      (error) => {
        console.error('Error adding to cart:', error);
      }
    );
  }

  removeFromCart(index: number): void {
    const currentItems = [...this.cartItems.value];
    currentItems.splice(index, 1);
    this.cartItems.next(currentItems);
  }

  clearCart(email: string): void {
    this.http.post(`${this.baseUrl}/clear`, { email }).subscribe(() => {
      this.cartItems.next([]);
    });
  }
}
