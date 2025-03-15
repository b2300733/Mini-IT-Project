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
    this.cartService.getCartItems().subscribe((items) => {
      this.cartItems = items;
    });
  }

  removeItem(index: number): void {
    this.cartService.removeFromCart(index);
    alert('Item have been removed successfully!');
  }

  getTotalItems(): number {
    return this.cartItems.length;
    // return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalAmount(): number {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }

  checkout(): void {
    console.log('Proceeding to checkout...');
    alert('Proceeding to checkout...');
  }
}
