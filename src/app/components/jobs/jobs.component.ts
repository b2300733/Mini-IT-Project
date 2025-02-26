import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface ServiceListing {
  category: string;
  detail: string;
  address: string;
  phoneNumber: string;
  ownerName: string;
  petName: string;
  note: string;
  hourRate: number;
}

@Component({
  selector: 'app-jobs',
  standalone: false,
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent {
  serviceCategories = [
    'Day Care',
    'Pet Sitting',
    'Pet Walking',
    'Grooming'
  ];

  selectedCategory: string = '';
  searchLocation: string = '';
  showListingForm: boolean = false;

  listings: ServiceListing[] = [
    {
      category: 'Day Care',
      detail: 'Need someone to take care of my golden retriever during office hours',
      address: '123 Pine Street, Singapore',
      phoneNumber: '91234567',
      ownerName: 'John Smith',
      petName: 'Max',
      note: 'Max is friendly but needs regular walks',
      hourRate: 15
    },
    {
      category: 'Pet Walking',
      detail: 'Looking for someone to walk my corgi twice a day',
      address: '456 Oak Avenue, Singapore',
      phoneNumber: '98765432',
      ownerName: 'Sarah Lee',
      petName: 'Coco',
      note: 'Coco needs to be walked morning and evening',
      hourRate: 12
    },
    {
      category: 'Grooming',
      detail: 'Monthly grooming service needed for my persian cat',
      address: '789 Maple Road, Singapore',
      phoneNumber: '90001111',
      ownerName: 'Mike Chen',
      petName: 'Luna',
      note: 'Luna needs special attention for her long fur',
      hourRate: 25
    }
  ];
  
  listingForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.listingForm = this.fb.group({
      category: ['', Validators.required],
      detail: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{8,}$')]],
      ownerName: ['', Validators.required],
      petName: ['', Validators.required],
      note: [''],
      hourRate: ['', [Validators.required, Validators.min(0)]]
    });
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.target.value;
  }

  onLocationSearch(event: any) {
    this.searchLocation = event.target.value;
  }

  toggleListingForm() {
    this.showListingForm = !this.showListingForm;
  }

  submitListing() {
    if (this.listingForm.valid) {
      console.log(this.listingForm.value);
      // Add your submission logic here
      this.listingForm.reset();
      this.showListingForm = false;
    }
  }
}