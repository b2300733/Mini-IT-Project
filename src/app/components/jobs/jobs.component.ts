import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface ServiceListing {
  category: string;
  title: string;
  address: string;
  phoneNumber: string;
  ownerName: string;
  petType: string;
  note: string;
  hourRate: number;
}

@Component({
  selector: 'app-jobs',
  standalone: false,
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css'],
})
export class JobsComponent {
  serviceCategories = ['Day Care', 'Pet Sitting', 'Pet Walking', 'Grooming'];

  selectedCategory: string = '';
  searchLocation: string = '';
  showListingForm: boolean = false;
  private originalListings: ServiceListing[] = [];

  listings: ServiceListing[] = [
    {
      category: 'Day Care',
      title:
        'Need someone to take care of my golden retriever during office hours',
      address: 'Shah Alam, Selangor',
      phoneNumber: '0123456789',
      ownerName: 'Frannie',
      petType: 'Dog',
      note: 'Max is friendly but needs regular walks',
      hourRate: 15,
    },
    {
      category: 'Pet Walking',
      title: 'Looking for someone to walk my corgi twice a day',
      address: 'Subang Jaya, Selangor',
      phoneNumber: '0131234567',
      ownerName: 'Thenh Thing',
      petType: 'Cat',
      note: 'Coco needs to be walked morning and evening',
      hourRate: 12,
    },
    {
      category: 'Grooming',
      title: 'Monthly grooming service needed for my persian cat',
      address: 'George Town, Penang',
      phoneNumber: '0162223333',
      ownerName: 'Ma Yun',
      petType: 'Dog',
      note: 'Luna needs special attention for her long fur',
      hourRate: 25,
    },
  ];

  listingForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.listingForm = this.fb.group({
      category: ['', Validators.required],
      title: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{8,}$')],
      ],
      ownerName: ['', Validators.required],
      petType: ['', Validators.required],
      note: [''],
      hourRate: ['', [Validators.required, Validators.min(0)]],
    });
    this.originalListings = [...this.listings];
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.target.value;
    this.filterListings();
  }

  onLocationSearch(event: any) {
    this.searchLocation = event.target.value.toLowerCase();
    this.filterListings();
  }

  private filterListings() {
    this.listings = this.originalListings.filter((listing) => {
      const matchesCategory =
        !this.selectedCategory || listing.category === this.selectedCategory;
      const matchesLocation =
        !this.searchLocation ||
        listing.address.toLowerCase().includes(this.searchLocation);
      return matchesCategory && matchesLocation;
    });
  }

  clearFilters() {
    this.selectedCategory = '';
    this.searchLocation = '';
    this.listings = [...this.originalListings];
  }

  toggleListingForm() {
    this.showListingForm = !this.showListingForm;
  }

  submitListing() {
    if (this.listingForm.valid) {
      // Create new listing from form values
      const newListing: ServiceListing = {
        category: this.listingForm.value.category,
        title: this.listingForm.value.title,
        address: this.listingForm.value.address,
        phoneNumber: this.listingForm.value.phoneNumber,
        ownerName: this.listingForm.value.ownerName,
        petType: this.listingForm.value.petType,
        note: this.listingForm.value.note,
        hourRate: this.listingForm.value.hourRate,
      };

      // Add to both lists
      this.listings.unshift(newListing);
      this.originalListings.unshift(newListing);

      // Show success message
      alert('Service listing created successfully!');

      // Reset form and close
      this.listingForm.reset();
      this.showListingForm = false;

      // Reapply any active filters
      if (this.selectedCategory || this.searchLocation) {
        this.filterListings();
      }
    } else {
      // Show validation errors
      Object.keys(this.listingForm.controls).forEach((key) => {
        const control = this.listingForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  // Add this helper method for form validation
  showError(fieldName: string): boolean {
    const field = this.listingForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
}
