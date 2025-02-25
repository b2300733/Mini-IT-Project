import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  condition: string;
  size: string;
  category: string;
  description: string;
  deliveryOptions: string[];
}

interface Seller {
  name: string;
  username: string;
  avatar?: string;
  joinDate: string;
  responseTime: string;
}

@Component({
  selector: 'app-productpage',
  standalone: false,
  templateUrl: './productpage.component.html',
  styleUrl: './productpage.component.css'
})
export class ProductpageComponent implements OnInit {
  product: Product = {
    id: '',
    title: '',
    price: 0,
    image: '',
    condition: '',
    size: '',
    category: '',
    description: '',
    deliveryOptions: ['Meetup', 'Delivery available']
  };

  seller: Seller = {
    name: '',
    username: '',
    avatar: 'assets/seller-avatar.jpg',
    joinDate: 'Joined 2 years ago',
    responseTime: 'Typically responds within 1 hour'
  };

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.product = {
        id: params['id'] || '',
        title: params['name'] || '',
        price: Number(params['price']) || 0, // Ensure price is parsed as a number
        image: params['img'] || '',
        condition: params['condition'] || '',
        size: params['size'] || '',
        category: params['category'] || '',
        description: params['description'] || '',
        deliveryOptions: params['deliveryOptions'] ? params['deliveryOptions'].split(',') : ['Meetup', 'Delivery available']
      };
      
      this.seller = {
        name: params['user'] || '',
        username: `@${params['user']?.toLowerCase() || 'user'}`,
        joinDate: 'Joined 2 years ago',
        responseTime: 'Typically responds within 1 hour'
      };
    });
  }

  makeOffer(): void {
    console.log('Make offer clicked');
  }

  startChat(): void {
    console.log('Chat clicked');
  }

  buyNow(): void {
    console.log('Buy now clicked');
  }

  handleImageError(event: Event) {
    (event.target as HTMLImageElement).src = '/product-1.jpg';
  }

  handleAvatarError(event: Event) {
    (event.target as HTMLImageElement).src = '/product-1.jpg';
  }
}

//assets/placeholder
