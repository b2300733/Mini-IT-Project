import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface ShopProduct {
  title: string;
  price: number;
  images: string[];
  brand: string;
  description: string;
  specification: string;
  quantity: number;
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
    title: '',
    price: 0,
    images: [],
    brand: '',
    description: '',
    specification: '',
    quantity: 0,
  };

  quantity: number = 1;
  message: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.product = {
        title: params['name'] || '',
        price: Number(params['price']) || 0,
        images: params['images']?.split(',') || [params['img']] || [],
        brand: params['brand'] || '',
        description: params['description'] || 'No description available',
        specification: params['specification'] || 'No description available',
        quantity: Number(params['quantity']) || 0,
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
    console.log(`Adding ${this.quantity} items to cart`);
    // Implement cart functionality
  }

  getRatingStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }
}
