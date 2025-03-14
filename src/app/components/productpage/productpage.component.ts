import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {
  CartService,
  CartItem,
} from '../../../../backend/services/cart.service';

interface Product {
  id: string;
  title: string;
  price: number;
  quantity: number;
  condition: string;
  category: string;
  subcategory: string;
  description: string;
  deliveryOptions: string[];
  images: string[];
}

interface Seller {
  name: string;
  username: string;
  avatar: string;
  joinDate: string;
  responseTime: string;
}

@Component({
  selector: 'app-productpage',
  standalone: false,
  templateUrl: './productpage.component.html',
  styleUrl: './productpage.component.css',
})
export class ProductpageComponent implements OnInit {
  currentImageIndex: number = 0;

  product: Product = {
    id: '',
    images: [],
    title: '',
    price: 0,
    quantity: 0,
    condition: '',
    category: '',
    subcategory: '',
    description: '',
    deliveryOptions: ['MeetUp', 'Delivery Available'],
  };

  seller: Seller = {
    name: '',
    username: '',
    avatar: '',
    joinDate: 'Joined 2 years ago',
    responseTime: 'Typically responds within 1 hour',
  };

  quantity: number = 1;
  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const deliveryOpts = params['deliveryOptions']?.split(',') || [];

      this.product = {
        id: params['id'] || '',
        title: params['name'] || '',
        price: Number(params['price']) || 0,
        quantity: Number(params['quantity']) || 0,
        images: params['images']?.split(',') || [params['img']] || [],
        condition: params['condition'] || '',
        category: params['category'] || '',
        subcategory: params['subcategory'] || '',
        description: params['description'] || '',
        deliveryOptions: deliveryOpts.map((opt: string) =>
          this.formatDeliveryOption(opt)
        ),
      };

      this.seller = {
        name: params['user'] || '',
        username: `@${params['user']?.toLowerCase() || 'user'}`,
        avatar: params['avatar'],
        joinDate: 'Joined 2 years ago',
        responseTime: 'Typically responds within 1 hour',
      };
    });
  }

  nextImage(): void {
    if (this.currentImageIndex < this.product.images.length - 1) {
      this.currentImageIndex++;
    }
  }

  previousImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  handleImageError(event: Event) {
    (event.target as HTMLImageElement).src = '/product-1.jpg';
  }

  handleAvatarError(event: Event) {
    (event.target as HTMLImageElement).src = '/product-1.jpg';
  }

  getConditionLabel(condition: string): string {
    const conditionMap: { [key: string]: string } = {
      brandNew: 'Brand New',
      likeNew: 'Like New',
      lightlyUsed: 'Lightly Used',
      wellUsed: 'Well Used',
      heavilyUsed: 'Heavily Used',
    };
    return conditionMap[condition] || condition || 'Not Specified';
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

  private formatDeliveryOption(option: string): string {
    const optionMap: { [key: string]: string } = {
      meetup: 'Meet Up',
      delivery: 'Delivery Available',
    };
    return optionMap[option.toLowerCase()] || option;
  }

  isLoggedIn(): boolean {
    return (
      !!localStorage.getItem('authToken') ||
      !!sessionStorage.getItem('authToken')
    );
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
      productName: this.product.title,
      quantity: this.quantity,
      price: this.product.price * this.quantity,
    };

    this.cartService.addToCart(cartItem);
    console.log('Added to cart:', cartItem);
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
}
