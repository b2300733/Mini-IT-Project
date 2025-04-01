import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {
  CartService,
  CartItem,
} from '../../../../backend/services/cart.service';

interface Product {
  _id: string;
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
  email: string;
}

@Component({
  selector: 'app-productpage',
  standalone: false,
  templateUrl: './productpage.component.html',
  styleUrl: './productpage.component.css',
})
export class ProductpageComponent implements OnInit {
  currentImageIndex: number = 0;
  isCurrentUserSeller: boolean = false;

  product: Product = {
    _id: '',
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
    email: '',
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
        _id: params['_id'] || '',
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
        email: params['email'] || '',
      };

      // Check if current user is the seller
      const currentUserEmail =
        localStorage.getItem('email') || sessionStorage.getItem('email');
      this.isCurrentUserSeller = currentUserEmail === this.seller.email;
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

    // Convert to array if category contains multiple values
    if (category?.includes(',')) {
      return category
        .split(',')
        .map(
          (cat) =>
            mainCategories[cat.toLowerCase().trim()] ||
            this.capitalizeFirstLetter(cat)
        )
        .join(' • ');
    }

    return (
      mainCategories[category?.toLowerCase()] ||
      this.capitalizeFirstLetter(category) ||
      'Not Specified'
    );
  }

  // Add this helper method
  private capitalizeFirstLetter(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
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
      productTitle: this.product.title,
      quantity: this.quantity,
      price: this.product.price * this.quantity,
      productId: this.product._id,
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

  editProduct(): void {
    const productId = this.product._id || this.product.id;

    if (!productId) {
      console.error('Cannot edit product: missing product ID');
      alert('Error: Cannot edit this product because the ID is missing');
      return;
    }

    // Navigate to edit product page with the product ID
    console.log('Editing product with ID:', productId);
    this.router.navigate(['/edit-product'], {
      queryParams: {
        id: productId,
      },
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
}
