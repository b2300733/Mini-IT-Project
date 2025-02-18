import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

interface Listing {
  id: number;
  itemName: string;
  description: string;
  price: number;
  sellerName: string;
  date: Date;
}

@Component({
  selector: 'app-communitymarket',
  standalone: false,
  templateUrl: './communitymarket.component.html',
  styleUrl: './communitymarket.component.css'
})
export class CommunitymarketComponent {
  listingForm: FormGroup;
  listings: Listing[] = [];
  nextId = 1;

  constructor(private fb: FormBuilder) {
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
}
