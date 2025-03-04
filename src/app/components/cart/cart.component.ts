import { Component } from '@angular/core';

interface CartItem {
  userAvatar: string;
  userName: string;
  productImg: string;
  productName: string;
  condition: string;
  price: number;
}

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  cartItems: CartItem[] = [
    {
      userAvatar: '',
      userName: 'John Doe',
      productImg: '',
      productName: 'Pet Carrier',
      condition: 'New',
      price: 59.99,
    },
    // Add more items as needed
  ];

  removeItem(index: number): void {
    this.cartItems.splice(index, 1);
  }

  getTotalItems(): number {
    return this.cartItems.length;
  }

  getTotalAmount(): number {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }

  checkout(): void {
    console.log('Proceeding to checkout...');
    // Implement checkout logic
  }
}
