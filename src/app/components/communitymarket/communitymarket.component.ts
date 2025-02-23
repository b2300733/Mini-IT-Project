import { Component, ElementRef, ViewChild } from '@angular/core';
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
  subcategory?: string;
  description?: string;
  deliveryOptions?: string[];
}

interface UploadedPhoto {
  url: string;
  file: File;
}

@Component({
  selector: 'app-communitymarket',
  standalone: false,
  templateUrl: './communitymarket.component.html',
  styleUrl: './communitymarket.component.css'
})
export class CommunitymarketComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  listingForm: FormGroup;
  listings: Product[] = [];
  nextId = 1;
  isDogExpanded = false;
  isCatExpanded = false;
  isOtherExpanded = false;
  activeCategory: string | null = null;
  activeSubcategory: string | null = null;
  showListingForm = false;
  currentStep = 1;
  uploadedPhotos: UploadedPhoto[] = [];
  selectedCategory: string | null = null;
  selectedSubcategory: string | null = null;

  // Define categories and conditions
  mainCategories = [
    { value: 'dog', label: 'Dog', icon: '🐶' },
    { value: 'cat', label: 'Cat', icon: '🐱' },
    { value: 'other', label: 'Other', icon: '🐾' }
  ];
  subcategories = [
    { value: 'accessories', label: 'Accessories' },
    { value: 'toys', label: 'Toys' },
    { value: 'clothes', label: 'Clothes' }
  ];

  conditions = [
    { value: 'brandNew', label: 'Brand New' },
    { value: 'likeNew', label: 'Like New' },
    { value: 'lightlyUsed', label: 'Lightly Used' },
    { value: 'wellUsed', label: 'Well Used' },
    { value: 'heavilyUsed', label: 'Heavily Used' }
  ];

  constructor(private fb: FormBuilder, private router: Router) {
    this.listingForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      condition: ['', Validators.required],
      priceType: ['sale', Validators.required],
      price: [null, [Validators.required, Validators.min(0.01)]]
    });

    // Set up validators that depend on other fields
    this.listingForm.get('priceType')?.valueChanges.subscribe(value => {
      const priceControl = this.listingForm.get('price');
      if (value === 'free') {
        priceControl?.clearValidators();
      } else {
        priceControl?.setValidators([Validators.required, Validators.min(0.01)]);
      }
      priceControl?.updateValueAndValidity();
    });

    // Initialize products
    this.products = [
      { id: '1', img: '/catbowl.jpg', name: 'Cat Bowl', price: 50.00, user: 'Titus', condition: 'Like New', category: 'cat', subcategory: 'accessories' },
      { id: '2', img: '/dogchair.jpg', name: 'Dog Chair', price: 75.00, user: 'Alex', condition: 'New', category: 'dog', subcategory: 'accessories' },
      { id: '3', img: '/dogpillow.jpg', name: 'Dog Pillow', price: 120.00, user: 'John', condition: 'Used', category: 'dog', subcategory: 'accessories' },
      { id: '4', img: '/dogbone.jpg', name: 'Dog Bone Toy', price: 100.00, user: 'Ash', condition: 'Used', category: 'dog', subcategory: 'toys' }
    ];
  }
  
  showValidationError(field: string): boolean {
    const control = this.listingForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  // Navigation methods
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

  // Category dropdown methods
  toggleCategory(category: string) {
    switch(category) {
      case 'dog':
        this.isDogExpanded = !this.isDogExpanded;
        this.isCatExpanded = false;
        this.isOtherExpanded = false;
        break;
      case 'cat':
        this.isCatExpanded = !this.isCatExpanded;
        this.isDogExpanded = false;
        this.isOtherExpanded = false;
        break;
      case 'other':
        this.isOtherExpanded = !this.isOtherExpanded;
        this.isDogExpanded = false;
        this.isCatExpanded = false;
        break;
    }
  }

  selectSubcategoryFilter(category: string, subcategory: string) {
    // Close all dropdowns
    this.isDogExpanded = false;
    this.isCatExpanded = false;
    this.isOtherExpanded = false;
    
    // Set active filters
    this.activeCategory = category;
    this.activeSubcategory = subcategory;
    
    // Filter products
    this.products = this.products.filter((product: Product) => {
      return product.category === category && product.subcategory === subcategory;
    });
  }
  
  clearFilters() {
    this.activeCategory = null;
    this.activeSubcategory = null;
    this.products = [...this.products];
  }

  // Listing form methods
  openListingForm() {
    this.showListingForm = true;
    this.currentStep = 1;
    this.resetListingForm();
  }
  
  closeListingForm() {
    this.showListingForm = false;
  }
  
  resetListingForm() {
    this.listingForm.reset({
      priceType: 'sale'
    });
    this.uploadedPhotos = [];
    this.selectedCategory = null;
    this.selectedSubcategory = null;
    this.currentStep = 1;
  }
  
  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }
  
  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  
  // Photo upload methods
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
  
  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      // Ensure we don't exceed 10 photos
      const remainingSlots = 10 - this.uploadedPhotos.length;
      const filesToProcess = Math.min(remainingSlots, files.length);
      
      for (let i = 0; i < filesToProcess; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          // Create a URL for the image preview
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.uploadedPhotos.push({
              url: e.target.result,
              file: file
            });
          };
          reader.readAsDataURL(file);
        }
      }
    }
    // Reset the input so the same file can be selected again
    this.fileInput.nativeElement.value = '';
  }
  
  removePhoto(index: number) {
    this.uploadedPhotos.splice(index, 1);
  }
  
  // Category selection methods
  selectCategory(category: string) {
    this.selectedCategory = category;
    this.selectedSubcategory = null; // Reset subcategory when changing main category
  }
  
  selectSubcategory(subcategory: string) {
    this.selectedSubcategory = subcategory;
  }
  
  // Condition selection method
  setCondition(condition: string) {
    this.listingForm.patchValue({ condition });
  }
  
  // Submit listing
  submitListing() {
    if (this.listingForm.valid && this.uploadedPhotos.length > 0 && this.selectedCategory && this.selectedSubcategory) {
      // Prepare the new product
      const newProduct: Product = {
        id: 'new_' + this.nextId++,
        img: this.uploadedPhotos[0].url, // Use the first photo as the main image
        name: this.listingForm.value.title,
        price: this.listingForm.value.priceType === 'free' ? 0 : this.listingForm.value.price,
        user: 'You', // In a real app, this would be the current user's name
        condition: this.listingForm.value.condition,
        category: this.selectedCategory,
        subcategory: this.selectedSubcategory,
        description: this.listingForm.value.description || ''
      };
      
      // Add to products list
      this.products.unshift(newProduct);
      
      // Reset and close the form
      this.closeListingForm();
      
      // Show a success message (in a real app, this would be a more sophisticated notification)
      alert('Your item has been listed successfully!');
    }
  }
  
  products: Product[] = [];
}
