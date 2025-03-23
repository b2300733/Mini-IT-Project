import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommunitymarketService } from '../../../../backend/services/communitymarket.service';

interface UploadedPhoto {
  url: string;
  file: File;
  existing?: boolean;
  path?: string;
}

@Component({
  selector: 'app-editproduct',
  standalone: false,
  templateUrl: './editproduct.component.html',
  styleUrl: './editproduct.component.css',
})
export class EditproductComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  editForm: FormGroup;
  uploadedPhotos: UploadedPhoto[] = [];
  selectedCategory: string | null = null;
  selectedSubcategory: string | null = null;
  productId: string | null = null;
  isLoading = true;
  originalProductData: any = null;

  email =
    (localStorage.getItem('email') || sessionStorage.getItem('email')) ?? '';

  deliveryOptions = [
    { value: 'meetup', Label: 'MeetUp' },
    { value: 'delivery', Label: 'Delivery Available' },
  ];

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private communitymarketService: CommunitymarketService
  ) {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      condition: ['', Validators.required],
      priceType: ['sale', Validators.required],
      price: [null, [Validators.required, Validators.min(0.01)]],
      quantity: ['', Validators.required],
      deliveryOptions: [[], Validators.required],
    });

    // Set up validators that depend on other fields
    this.editForm.get('priceType')?.valueChanges.subscribe((value) => {
      const priceControl = this.editForm.get('price');
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
    // Get product ID from route parameters
    this.route.queryParams.subscribe((params) => {
      this.productId = params['id'];
      console.log('Product ID from route params:', this.productId);

      // Load product data based on ID
      if (this.productId) {
        this.loadProductData(this.productId);
      } else {
        console.error('No product ID found in route params');
        this.isLoading = false;
      }
    });
  }

  loadProductData(id: string): void {
    this.isLoading = true;
    console.log('Loading product data for ID:', id);

    this.communitymarketService.getProductById(id).subscribe({
      next: (product: any) => {
        console.log('Product data received:', product);
        this.originalProductData = product;

        // Set form values
        this.editForm.patchValue({
          title: product.productTitle,
          description: product.productDesc || '',
          condition: product.condition,
          priceType: parseFloat(product.productPrice) > 0 ? 'sale' : 'free',
          price: parseFloat(product.productPrice),
          quantity: product.productQuantity,
          deliveryOptions: this.mapDeliveryOptions(product.deliveryOpt),
        });

        // Set categories
        this.selectedCategory = product.category;
        this.selectedSubcategory = product.subCategory;

        // Load images
        this.uploadedPhotos = (product.productImg || []).map(
          (imgPath: string) => ({
            url: imgPath,
            existing: true,
            path: imgPath,
          })
        );

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading product data:', error);
        alert('Failed to load product data. Please try again.');
        this.isLoading = false;
      },
    });
  }

  mapDeliveryOptions(options: string[]): string[] {
    if (!options || !Array.isArray(options)) return [];

    return options.map((opt) => {
      if (opt.toLowerCase().includes('meet')) return 'meetup';
      if (opt.toLowerCase().includes('delivery')) return 'delivery';
      return opt.toLowerCase();
    });
  }

  showValidationError(field: string): boolean {
    const control = this.editForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  toggleContent() {
    if (!this.isLoggedIn()) {
      // Redirect to login page if not logged in
      alert('Please login first to edit items');
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/market']);
    this.resetEditForm();
  }

  resetEditForm() {
    this.editForm.reset({
      priceType: 'sale',
    });
    this.uploadedPhotos = [];
    this.selectedCategory = null;
    this.selectedSubcategory = null;
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
    this.editForm.patchValue({ condition });
  }

  toggleDeliveryOption(option: string) {
    const deliveryOptions = this.editForm.get('deliveryOptions')?.value || [];
    const index = deliveryOptions.indexOf(option);
    if (index === -1) {
      deliveryOptions.push(option);
    } else {
      deliveryOptions.splice(index, 1);
    }
    if (deliveryOptions) {
      this.editForm.patchValue({ deliveryOptions });
    }
  }

  saveChanges(): void {
    if (!this.isLoggedIn()) {
      alert('Please login first to edit items');
      this.router.navigate(['/login']);
      return;
    }

    if (
      !this.editForm.valid ||
      this.uploadedPhotos.length === 0 ||
      !this.selectedCategory ||
      !this.selectedSubcategory ||
      !this.productId
    ) {
      alert('Please fill in all required fields and add at least one photo.');
      return;
    }

    const formData = new FormData();
    formData.append('productId', this.productId);
    formData.append('productTitle', this.editForm.value.title);
    formData.append('productDesc', this.editForm.value.description || '');
    formData.append(
      'productPrice',
      this.editForm.value.priceType === 'free' ? '0' : this.editForm.value.price
    );
    formData.append('productQuantity', this.editForm.value.quantity);
    formData.append('category', this.selectedCategory);
    formData.append('subCategory', this.selectedSubcategory);
    formData.append('condition', this.editForm.value.condition);
    formData.append(
      'deliveryOpt',
      this.editForm.value.deliveryOptions.join(',')
    );
    formData.append('userEmail', this.email);

    // Track existing images to keep
    const existingImagesToKeep: string[] = [];

    // Append new photos and keep track of existing ones
    this.uploadedPhotos.forEach((photo, index) => {
      if (photo.existing && photo.path) {
        existingImagesToKeep.push(photo.path);
      } else if (photo.file) {
        formData.append('newProductImg', photo.file);
      }
    });

    // Add the list of existing images to keep
    formData.append('existingImages', JSON.stringify(existingImagesToKeep));

    // Send update request using the service
    this.communitymarketService.updateProduct(formData).subscribe({
      next: (response: any) => {
        alert('Product updated successfully!');
        // Navigate back to product page
        this.router.navigate(['/product'], {
          queryParams: { id: this.productId },
        });
      },
      error: (error) => {
        console.error('Error updating product:', error);
        alert('Failed to update product. Please try again.');
      },
    });
  }

  isLoggedIn(): boolean {
    return (
      !!localStorage.getItem('authToken') ||
      !!sessionStorage.getItem('authToken')
    );
  }
}
