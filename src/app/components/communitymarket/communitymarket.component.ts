import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommunitymarketService } from '../../../../backend/services/communitymarket.service';

interface Product {
  productImg: string[];
  productTitle: string;
  productPrice: number;
  username: string;
  userEmail: string;
  userAvatar: string;
  condition: string;
  productQuantity: number;
  size?: string;
  category?: string;
  subCategory: string;
  productDesc?: string;
  deliveryOpt?: string[];
  createdAt: string;
}

interface UploadedPhoto {
  url: string;
  file: File;
}

@Component({
  selector: 'app-communitymarket',
  standalone: false,
  templateUrl: './communitymarket.component.html',
  styleUrl: './communitymarket.component.css',
})
export class CommunitymarketComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  listingForm: FormGroup;
  listings: Product[] = [];
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
  isContentHidden = false;
  activeSubcategories: string[] = [];
  searchQuery: string = '';

  email =
    (localStorage.getItem('email') || sessionStorage.getItem('email')) ?? '';

  deliveryOptions = [
    { value: 'meetup', Label: 'MeetUp' },
    { value: 'delivery', Label: 'Delivery Available' },
  ];

  // Define categories and conditions
  mainCategories = [
    { value: 'dog', label: 'Dog', icon: '🐶' },
    { value: 'cat', label: 'Cat', icon: '🐱' },
    { value: 'other', label: 'Other', icon: '🐾' },
  ];
  subcategories = [
    { value: 'accessories', label: 'Accessories' },
    { value: 'toys', label: 'Toys' },
    { value: 'clothes', label: 'Clothes' },
  ];

  conditions = [
    { value: 'brandNew', label: 'Brand New' },
    { value: 'likeNew', label: 'Like New' },
    { value: 'lightlyUsed', label: 'Lightly Used' },
    { value: 'wellUsed', label: 'Well Used' },
    { value: 'heavilyUsed', label: 'Heavily Used' },
  ];

  private originalProducts: Product[] = [];
  products: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private communitymarketService: CommunitymarketService
  ) {
    this.listingForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      condition: ['', Validators.required],
      priceType: ['sale', Validators.required],
      price: [null, [Validators.required, Validators.min(0.01)]],
      quantity: ['', Validators.required],
      deliveryOptions: [[], Validators.required],
    });

    // Set up validators that depend on other fields
    this.listingForm.get('priceType')?.valueChanges.subscribe((value) => {
      const priceControl = this.listingForm.get('price');
      if (value === 'free') {
        priceControl?.clearValidators();
      } else {
        priceControl?.setValidators([
          Validators.required,
          Validators.min(0.01),
        ]);
      }
      priceControl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.fetchProducts();

    this.route.queryParams.subscribe((params) => {
      if (params['openAddForm'] === 'true') {
        // Check if user is logged in before opening form
        if (this.isLoggedIn()) {
          this.isContentHidden = true;
          this.currentStep = 1;
        } else {
          // If not logged in, alert and redirect to login
          alert('Please login first to sell items');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  fetchProducts(): void {
    this.communitymarketService.getProducts().subscribe(
      (response) => {
        this.products = response;
        this.originalProducts = response;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  showValidationError(field: string): boolean {
    const control = this.listingForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  // Navigation methods
  navigateToProduct(product: Product) {
    this.router.navigate(['/product'], {
      queryParams: {
        name: product.productTitle,
        price: product.productPrice,
        quantity: product.productQuantity,
        condition: product.condition,
        images: product.productImg.join(','), // Pass all images
        img: product.productImg[0], // Keep the first image as default
        user: product.username,
        email: product.userEmail,
        avatar: product.userAvatar,
        description: product.productDesc,
        category: product.category,
        subcategory: product.subCategory,
        deliveryOptions: product.deliveryOpt?.join(','),
      },
    });
  }

  // Category dropdown methods
  toggleCategory(category: string) {
    switch (category) {
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

    // Handle multiple subcategories
    if (!this.activeSubcategories.includes(subcategory)) {
      this.activeSubcategories.push(subcategory);
    }

    // Filter products based on category and any of the selected subcategories
    this.products = this.originalProducts.filter((product: Product) => {
      return (
        product.category === category &&
        this.activeSubcategories.includes(product.subCategory)
      ); // Changed from subCategory?
    });
  }

  clearFilters() {
    this.activeCategory = null;
    this.activeSubcategories = [];
    this.products = [...this.originalProducts];
  }

  removeSubcategory(subcategory: string) {
    this.activeSubcategories = this.activeSubcategories.filter(
      (s) => s !== subcategory
    );

    if (this.activeSubcategories.length === 0) {
      // If no subcategories left, clear all filters
      this.clearFilters();
    } else {
      // Reapply filter with remaining subcategories
      this.products = this.originalProducts.filter((product: Product) => {
        return (
          product.category === this.activeCategory &&
          this.activeSubcategories.includes(product.subCategory || '')
        );
      });
    }
  }

  // Listing form methods
  toggleContent() {
    if (!this.isLoggedIn()) {
      // Redirect to login page if not logged in
      alert('Please login first to sell items');
      this.router.navigate(['/login']);
      return;
    }

    this.isContentHidden = !this.isContentHidden;
    if (this.isContentHidden) {
      this.currentStep = 1;
      this.resetListingForm();
    }
  }

  resetListingForm() {
    this.listingForm.reset({
      priceType: 'sale',
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

  calculateTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    now.setHours(now.getHours() + 8);
    const diffTime = Math.abs(now.getTime() - date.getTime());

    const diffSeconds = Math.floor(diffTime / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} days ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hours ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minutes ago`;
    } else {
      return `${diffSeconds} seconds ago`;
    }
  }

  onFileSelected(event: any) {
    const files = event.target.files;

    if (files) {
      // Ensure we don't exceed 10 photos
      const remainingSlots = 10 - this.uploadedPhotos.length;
      const filesToProcess = Math.min(remainingSlots, files.length);

      for (let i = 0; i < filesToProcess; i++) {
        const file = files[i];

        if (file.size > 3 * 1024 * 1024) {
          // 3MB limit
          alert('File size exceeds 3MB! Please upload a smaller file.');
          return;
        }

        if (file.type.startsWith('image/')) {
          // Create a URL for the image preview
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.uploadedPhotos.push({
              url: e.target.result,
              file: file,
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

  toggleDeliveryOption(option: string) {
    const deliveryOptions =
      this.listingForm.get('deliveryOptions')?.value || [];
    const index = deliveryOptions.indexOf(option);
    if (index === -1) {
      deliveryOptions.push(option);
    } else {
      deliveryOptions.splice(index, 1);
    }
    if (deliveryOptions) {
      this.listingForm.patchValue({ deliveryOptions });
    }
  }

  // Submit listing
  submitListing() {
    if (
      this.listingForm.valid &&
      this.uploadedPhotos.length > 0 &&
      this.selectedCategory &&
      this.selectedSubcategory
    ) {
      // Prepare the form data
      const formData = new FormData();
      formData.append('productTitle', this.listingForm.value.title);
      if (this.listingForm.value.description) {
        formData.append('productDesc', this.listingForm.value.description);
      }
      formData.append(
        'productPrice',
        this.listingForm.value.priceType === 'free'
          ? '0'
          : this.listingForm.value.price
      );
      formData.append('productQuantity', this.listingForm.value.quantity);
      formData.append('category', this.selectedCategory);
      formData.append('subCategory', this.selectedSubcategory);
      formData.append('condition', this.listingForm.value.condition);
      formData.append(
        'deliveryOpt',
        this.listingForm.value.deliveryOptions.join(',')
      );
      formData.append('userEmail', this.email);

      // Append photos
      this.uploadedPhotos.forEach((photo) => {
        formData.append('productImg', photo.file);
      });

      // Send the form data to the backend
      this.communitymarketService.uploadProduct(formData).subscribe(
        (response) => {
          // Handle success
          console.log('Product uploaded successfully:', response);
          // Reset and close the form
          this.toggleContent();
          // Show a success message
          alert('Your item has been listed successfully!');

          // Check if redirected from profile page
          const fromProfile =
            this.route.snapshot.queryParams['fromProfile'] === 'true';
          if (fromProfile) {
            // Redirect back to profile page with listings tab selected
            this.router.navigate(['/profile'], {
              queryParams: { tab: 'listings' },
            });
          } else {
            window.location.reload();
          }
        },
        (error) => {
          // Handle error
          console.error('Error uploading product:', error);
          alert('There was an error listing your item. Please try again.');
        }
      );
    }
  }

  searchProducts(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery = query;

    if (query === '') {
      // If search is empty and there are active filters, show filtered results
      if (this.activeCategory && this.activeSubcategories.length > 0) {
        this.products = this.originalProducts.filter((product: Product) => {
          return (
            product.category === this.activeCategory &&
            this.activeSubcategories.includes(product.subCategory || '')
          );
        });
      } else {
        // If no filters, show all products
        this.products = [...this.originalProducts];
      }
    } else {
      // Filter products based on search query and any active filters
      this.products = this.originalProducts.filter((product: Product) => {
        const matchesSearch = product.productTitle
          .toLowerCase()
          .includes(query);

        if (this.activeCategory && this.activeSubcategories.length > 0) {
          // Apply both search and category filters
          return (
            matchesSearch &&
            product.category === this.activeCategory &&
            this.activeSubcategories.includes(product.subCategory || '')
          );
        }

        // Apply only search filter
        return matchesSearch;
      });
    }
  }

  isLoggedIn(): boolean {
    return (
      !!localStorage.getItem('authToken') ||
      !!sessionStorage.getItem('authToken')
    );
  }
}
