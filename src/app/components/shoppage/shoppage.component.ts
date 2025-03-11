import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ShopService } from '../../../../backend/services/shop.service';
import { HttpClient } from '@angular/common/http';

interface ShopProduct {
  product_id: string;
  productImg: string[];
  productTitle: string;
  productPrice: number;
  productBrand: string;
  category: string;
  subCategory: string;
  productDesc: string;
  productSpec: string;
  productQuantity: number;
}

interface UploadedPhoto {
  url: string;
  file: File;
}

@Component({
  selector: 'app-shoppage',
  standalone: false,
  templateUrl: './shoppage.component.html',
  styleUrls: ['./shoppage.component.css'],
})
export class ShoppageComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  productForm: FormGroup;
  isDogExpanded = false;
  isCatExpanded = false;
  isOtherExpanded = false;
  activeCategory: string | null = null;
  activeSubcategories: string[] = [];
  searchQuery: string = '';
  isContentHidden = false;
  currentStep = 1;
  uploadedPhotos: UploadedPhoto[] = [];
  selectedCategory: string | null = null;
  selectedSubcategory: string | null = null;
  isAdminUser: boolean = false;

  email =
    (localStorage.getItem('email') || sessionStorage.getItem('email')) ?? '';

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

  private originalProducts: ShopProduct[] = [];
  products: ShopProduct[] = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private shopService: ShopService,
    private http: HttpClient
  ) {
    this.productForm = this.fb.group({
      brand: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      specification: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchProducts();
    this.fetchUserData();
  }

  fetchProducts(): void {
    this.shopService.getProducts().subscribe(
      (response) => {
        this.products = response;
        this.originalProducts = response;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  fetchUserData(): void {
    if (!this.email) return; // Skip if no email found

    this.http
      .get<{ isAdmin: boolean }>(
        `http://localhost:3000/api/users?email=${this.email}`
      )
      .subscribe(
        (response) => {
          this.isAdminUser = response.isAdmin;
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
  }

  showValidationError(field: string): boolean {
    const control = this.productForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

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
    this.isDogExpanded = false;
    this.isCatExpanded = false;
    this.isOtherExpanded = false;

    this.activeCategory = category;

    if (!this.activeSubcategories.includes(subcategory)) {
      this.activeSubcategories.push(subcategory);
    }

    this.products = this.originalProducts.filter((product: ShopProduct) => {
      return (
        product.category === category &&
        this.activeSubcategories.includes(product.subCategory || '')
      );
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
      this.clearFilters();
    } else {
      this.products = this.originalProducts.filter((product: ShopProduct) => {
        return (
          product.category === this.activeCategory &&
          this.activeSubcategories.includes(product.subCategory || '')
        );
      });
    }
  }

  searchProducts(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery = query;

    if (query === '') {
      if (this.activeCategory && this.activeSubcategories.length > 0) {
        this.products = this.originalProducts.filter((product: ShopProduct) => {
          return (
            product.category === this.activeCategory &&
            this.activeSubcategories.includes(product.subCategory || '')
          );
        });
      } else {
        this.products = [...this.originalProducts];
      }
    } else {
      this.products = this.originalProducts.filter((product: ShopProduct) => {
        const matchesSearch = product.productTitle
          .toLowerCase()
          .includes(query);

        if (this.activeCategory && this.activeSubcategories.length > 0) {
          return (
            matchesSearch &&
            product.category === this.activeCategory &&
            this.activeSubcategories.includes(product.subCategory || '')
          );
        }

        return matchesSearch;
      });
    }
  }

  navigateToProduct(product: ShopProduct) {
    this.router.navigate(['/shop-product'], {
      queryParams: {
        id: product.product_id,
        name: product.productTitle,
        price: product.productPrice,
        images: product.productImg.join(','),
        img: product.productImg[0],
        brand: product.productBrand,
        category: product.category,
        description: product.productDesc,
        specification: product.productSpec,
        subcategory: product.subCategory,
        quantity: product.productQuantity,
      },
    });
  }

  // Listing form methods
  toggleContent() {
    this.isContentHidden = !this.isContentHidden;
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

  // Submit listing
  submitProduct() {
    if (
      this.productForm.valid &&
      this.uploadedPhotos.length > 0 &&
      this.selectedCategory &&
      this.selectedSubcategory
    ) {
      // Prepare the form data
      const formData = new FormData();
      formData.append('productBrand', this.productForm.value.brand);
      formData.append('productTitle', this.productForm.value.title);
      formData.append('productDesc', this.productForm.value.description);
      formData.append('productSpec', this.productForm.value.specification);
      formData.append('productPrice', this.productForm.value.price);
      formData.append('category', this.selectedCategory);
      formData.append('subCategory', this.selectedSubcategory);
      formData.append('productQuantity', this.productForm.value.quantity);
      formData.append('userEmail', this.email);
      // Append photos
      this.uploadedPhotos.forEach((photo) => {
        formData.append('productImg', photo.file);
      });
      // Send the form data to the backend
      this.shopService.uploadProduct(formData).subscribe(
        (response) => {
          // Handle success
          console.log('Product uploaded successfully:', response);
          // Reset and close the form
          this.toggleContent();
          // Show a success message (in a real app, this would be a more sophisticated notification)
          alert('Your item has been listed successfully!');
          window.location.reload();
        },
        (error) => {
          // Handle error
          console.error('Error uploading product:', error);
          alert('There was an error listing your item. Please try again.');
        }
      );
    }
  }

  isAdmin(): boolean {
    return this.isAdminUser;
  }
}
