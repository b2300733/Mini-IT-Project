import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {
  CartService,
  CartItem,
} from '../../../../backend/services/cart.service';

interface ShopProduct {
  id: string;
  title: string;
  price: number;
  images: string[];
  brand: string;
  description: string;
  specification: string;
  quantity: number;
  category: string;
  subcategory: string;
}

interface Review {
  username: string;
  rating: number;
  comment: string;
  date: string;
}

@Component({
  selector: 'app-shopproductpage',
  standalone: false,
  templateUrl: './shopproductpage.component.html',
  styleUrls: ['./shopproductpage.component.css'],
})
export class ShopproductpageComponent implements OnInit {
  product: ShopProduct = {
    id: '',
    title: '',
    price: 0,
    images: [],
    brand: '',
    description: '',
    specification: '',
    quantity: 0,
    category: '',
    subcategory: '',
  };

  quantity: number = 1;
  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.product = {
        id: params['id'] || '',
        title: params['name'] || '',
        price: Number(params['price']) || 0,
        images: params['images']?.split(',') || [params['img']] || [],
        brand: params['brand'] || '',
        description: params['description'] || 'No description available',
        specification: params['specification'] || 'No description available',
        quantity: Number(params['quantity']) || 0,
        category: params['category'] || '',
        subcategory: params['subcategory'] || '',
      };
    });
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
      this.message = '';
    }
  }

  increaseQuantity(): void {
    if (this.quantity < this.product.quantity) {
      this.quantity++;
      this.message = '';
    } else {
      this.message =
        'You have reached the maximum quantity available for this item';
    }
  }

  addToCart(): void {
    if (!this.isLoggedIn()) {
      // Redirect to login page if not logged in
      alert('Please login first to sell items');
      this.router.navigate(['/login']);
      return;
    }

    const cartItem: CartItem = {
      productImg: this.product.images[0],
      productTitle: this.product.title,
      quantity: this.quantity,
      price: this.product.price * this.quantity,
    };

    const userEmail =
      localStorage.getItem('email') || sessionStorage.getItem('email');

    if (userEmail) {
      this.cartService.addToCart(cartItem);
      console.log('Added to cart:', cartItem);
      alert('Item added to cart successfully!');
    } else {
      // This shouldn't happen if isLoggedIn() returns true, but just in case
      alert('Error: User email not found. Please log in again.');
      this.router.navigate(['/login']);
    }
  }

  getRatingStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  getCategoryLabel(category: string): string {
    // Match the categories from CommunityMarketComponent
    const mainCategories: { [key: string]: string } = {
      dog: 'Dog',
      cat: 'Cat',
      other: 'Other',
    };

    const subcategories: { [key: string]: string } = {
      accessories: 'Accessories',
      toys: 'Toys',
      clothes: 'Clothes',
    };

    return (
      mainCategories[category] ||
      subcategories[category] ||
      category ||
      'Not Specified'
    );
  }

  getSubcategoryLabel(subcategory: string): string {
    const subcategories: { [key: string]: string } = {
      accessories: 'Accessories',
      toys: 'Toys',
      clothes: 'Clothes',
    };
    return (
      subcategories[subcategory?.toLowerCase()] ||
      subcategory ||
      'Not Specified'
    );
  }

  isLoggedIn(): boolean {
    return (
      !!localStorage.getItem('authToken') ||
      !!sessionStorage.getItem('authToken')
    );
  }
}
