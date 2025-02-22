import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface Product {
  id: string;
  img: string;
  name: string;
  price: number;
  user: string;
  condition: string;
  size?: string;
  category?: string;
  description?: string;
  deliveryOptions?: string[];
}

@Component({
  selector: 'app-communitymarket',
  standalone: false,
  templateUrl: './communitymarket.component.html',
  styleUrl: './communitymarket.component.css'
})
export class CommunitymarketComponent {
  listingForm: FormGroup;
  listings: Product[] = [];
  nextId = 1;

  constructor(private fb: FormBuilder, private router: Router) {
    this.listingForm = this.fb.group({
      itemName: ['', Validators.required],
      description: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0.01)]],
      sellerName: ['', Validators.required]
    });
  }
  
  showValidationError(field: string): boolean {
    const control = this.listingForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onSubmit() {
    if (this.listingForm.valid) {
      this.listings.push({
        id: this.nextId++,
        ...this.listingForm.value,
        date: new Date()
      });
      this.listingForm.reset();
    }
  }

  navigateToProduct(product: Product) {
    this.router.navigate(['/product'], {
      queryParams: {
        id: product.id,
        name: product.name,
        price: product.price,
        condition: product.condition,
        img: product.img,
        user: product.user
      }
    });
  }

  products: Product[] = [
    { id: '1', img: '/catbowl.jpg', name: 'Cat Bowl', price: 50.00, user: 'Titus', condition: 'Like New' },
    { id: '2', img: '/dogchair.jpg', name: 'Dog Chair', price: 75.00, user: 'Alex', condition: 'New' },
    { id: '3', img: '/dogpillow.jpg', name: 'Dog Pillow', price: 120.00, user: 'John', condition: 'Used' }
  ];
}
