import { Component, OnInit } from '@angular/core';

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
    id: '1',
    title: 'Nike Air Max 2023 - Limited Edition',
    price: 159.99,
    image: '/product-1.jpg',
    condition: 'Like new',
    size: 'UK 9 / US 10 / EU 44',
    category: 'Men\'s Shoes',
    description: 'Original Nike Air Max, barely used. Complete with original box.',
    deliveryOptions: ['Meetup', 'Delivery available']
  };

  seller: Seller = {
    name: 'John Store',
    username: '@johnstore',
    avatar: 'assets/seller-avatar.jpg',
    joinDate: 'Joined 2 years ago',
    responseTime: 'Typically responds within 1 hour'
  };

  constructor() { }

  ngOnInit(): void { }

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
    (event.target as HTMLImageElement).src = 'assets/placeholder.jpg';
  }

  handleAvatarError(event: Event) {
    (event.target as HTMLImageElement).src = '/product-1.jpg';
  }
}
