import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface Product {
  id: string;
  title: string;
  price: number;
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

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.product = {
        id: params['id'] || '',
        title: params['name'] || '',
        price: Number(params['price']) || 0,
        images: params['images']?.split(',') || [params['img']] || [],
        condition: params['condition'] || '',
        category: params['category'] || '',
        subcategory: params['subcategory'] || '',
        description: params['description'] || '',
        deliveryOptions: params['deliveryOptions']
          ? params['deliveryOptions'].split(',').map(this.formatDeliveryOption)
          : ['MeetUp', 'Delivery Available'],
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

  addCart(): void {
    console.log('Add to Cart clicked');
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
      clothes: 'Clothes'
    };
    return subcategories[subcategory?.toLowerCase()] || subcategory || 'Not Specified';
  }

  private formatDeliveryOption(option: string): string {
    const optionMap: { [key: string]: string } = {
      'meetup': 'MeetUp',
      'delivery': 'Delivery Available'
    };
    return optionMap[option.toLowerCase()] || option;
  }
}

//assets/placeholder
