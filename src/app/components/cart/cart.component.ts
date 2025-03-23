import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
  isProcessing: boolean = false;

  constructor(private cartService: CartService, private router: Router) {}

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
    if (this.isProcessing) return;

    this.isProcessing = true;

    this.cartService.checkout().subscribe(
      (response) => {
        this.isProcessing = false;

        // Display results to the user
        if (response.failedItems && response.failedItems.length > 0) {
          const failedItemNames = response.failedItems
            .map((item) => `${item.productTitle} (${item.reason})`)
            .join('\n');

          alert(
            `Checkout completed with some issues:\n${failedItemNames}\n\nOther items were purchased successfully.`
          );
        } else {
          alert('Checkout completed successfully!');
        }

        this.router.navigate(['/']);
      },
      (error) => {
        this.isProcessing = false;
        console.error('Error during checkout:', error);
        alert('There was an error processing your checkout. Please try again.');
      }
    );
  }
}
