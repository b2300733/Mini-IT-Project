import { Component } from '@angular/core';
import {
  CartService,
  CartItem,
} from '../../../../backend/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    if (email) {
      this.cartService.fetchCart(email);
    }

    this.cartService.getCartItems().subscribe((items) => {
      this.cartItems = items;
    });
  }

  removeItem(index: number): void {
    this.cartService.removeFromCart(index);
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalAmount(): number {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }

  checkout(): void {
    console.log('Proceeding to checkout...');
    // Implement checkout logic
  }
}
