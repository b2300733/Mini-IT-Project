import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  brand: string;
  weight: string;
  description: string;
  details: string[];
  rating: number;
  reviews: Review[];
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
  styleUrls: ['./shopproductpage.component.css']
})
export class ShopproductpageComponent implements OnInit {
  product: Product = {
    id: '',
    title: '',
    price: 0,
    image: '',
    brand: '',
    weight: '',
    description: '',
    details: [],
    rating: 0,
    reviews: []
  };

  quantity: number = 1;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.product = {
        id: params['id'] || '',
        title: params['name'] || '',
        price: Number(params['price']) || 0,
        image: params['img'] ? params['img'].replace('/images/', '') : 'placeholder.jpg',
        brand: params['brand'] || '',
        weight: params['weight'] || '1kg',
        description: params['description'] || 'No description available',
        details: params['details']?.split(',') || [
          'Premium quality pet product',
          'Suitable for all pet sizes',
          'Easy to clean and maintain'
        ],
        rating: 4.5,
        reviews: [
          {
            username: 'John D.',
            rating: 5,
            comment: 'Great product! My pet loves it.',
            date: '2024-02-20'
          },
          {
            username: 'Mary S.',
            rating: 4,
            comment: 'Good quality, but a bit pricey.',
            date: '2024-02-18'
          }
        ]
      };
    });
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  increaseQuantity(): void {
    this.quantity++;
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