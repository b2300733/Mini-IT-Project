import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  CartService,
  CartItem,
} from '../../../../backend/services/cart.service';
import { ShopService } from '../../../../backend/services/shop.service';

interface UploadedPhoto {
  url: string;
  file?: File;
  isExisting?: boolean;
}

interface ShopProduct {
  _id: string;
  id: string;
  title: string;
  price: number;
  images: string[];
  brand: string;
  description: string;
  specification: string;
  quantity: number;
  category: string;
  subcategory: string;
}

interface Review {
  username: string;
  rating: number;
  comment: string;
  date: string;
}

@Component({
  selector: 'app-shopproductpage',
  standalone: false,
  templateUrl: './shopproductpage.component.html',
  styleUrls: ['./shopproductpage.component.css'],
})
export class ShopproductpageComponent implements OnInit {
  product: ShopProduct = {
    _id: '',
    id: '',
    title: '',
    price: 0,
    images: [],
    brand: '',
    description: '',
    specification: '',
    quantity: 0,
    category: '',
    subcategory: '',
  };

  @ViewChild('fileInput') fileInput!: ElementRef;
  isEditing: boolean = false;
  productForm: FormGroup;
  uploadedPhotos: UploadedPhoto[] = [];
  selectedCategory: string | null = null;
  selectedSubcategory: string | null = null;

  mainCategories = [
    { value: 'dog', label: 'Dog', icon: '🐶' },
    { value: 'cat', label: 'Cat', icon: '🐱' },
    { value: 'other', label: 'Other', icon: '🐾' },
  ];
  subcategories = [
    { value: 'accessories', label: 'Accessories' },
    { value: 'toys', label: 'Toys' },
    { value: 'clothes', label: 'Clothes' },
    { value: 'food', label: 'Food' },
  ];

  isAdminUser: boolean = false;
  quantity: number = 1;
  message: string = '';
  currentImageIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cartService: CartService,
    private fb: FormBuilder,
    private shopService: ShopService
  ) {
    // Initialize form
    this.productForm = this.fb.group({
      brand: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      specification: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    // Keep your existing initialization code
    this.route.queryParams.subscribe((params) => {
      this.product = {
        _id: params['_id'] || '',
        id: params['id'] || '',
        title: params['name'] || '',
        price: Number(params['price']) || 0,
        images: params['images']?.split(',') || [params['img']] || [],
        brand: params['brand'] || '',
        description: params['description'] || 'No description available',
        specification: params['specification'] || 'No specification available',
        quantity: Number(params['quantity']) || 0,
        category: params['category'] || '',
        subcategory: params['subcategory'] || '',
      };
    });

    // Check if user is admin
    this.fetchUserData();
  }

  showValidationError(field: string): boolean {
    const control = this.productForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  fetchUserData(): void {
    const email =
      localStorage.getItem('email') || sessionStorage.getItem('email');
    if (!email) return;

    this.http
      .get<{ isAdmin: boolean }>(
        `http://localhost:3000/api/users?email=${email}`
      )
      .subscribe(
        (response) => {
          this.isAdminUser = response.isAdmin;
          console.log('User is admin:', this.isAdminUser);
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
  }

  editListing(): void {
    this.isEditing = true;

    // Populate form with current product details
    this.productForm.patchValue({
      brand: this.product.brand,
      title: this.product.title,
      description: this.product.description,
      specification: this.product.specification,
      price: this.product.price,
      quantity: this.product.quantity,
    });

    // Set category and subcategory
    this.selectedCategory = this.product.category;
    this.selectedSubcategory = this.product.subcategory;

    // Load existing images
    this.uploadedPhotos = this.product.images.map((img) => ({
      url: img,
      isExisting: true,
    }));

    // Scroll to form
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.uploadedPhotos = [];
  }

  // Photo management methods
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
          continue;
        }

        if (file.type.startsWith('image/')) {
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
    // Reset input
    this.fileInput.nativeElement.value = '';
  }

  removePhoto(index: number) {
    this.uploadedPhotos.splice(index, 1);
  }

  // Category selection methods
  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  selectSubcategory(subcategory: string) {
    this.selectedSubcategory = subcategory;
  }

  // Form submission
  submitProductUpdate() {
    if (
      this.productForm.valid &&
      this.uploadedPhotos.length > 0 &&
      this.selectedCategory &&
      this.selectedSubcategory
    ) {
      // Create FormData for the request
      const formData = new FormData();

      // Add basic fields
      formData.append('productId', this.product._id);
      formData.append('productBrand', this.productForm.value.brand);
      formData.append('productTitle', this.productForm.value.title);
      formData.append('productDesc', this.productForm.value.description);
      formData.append('productSpec', this.productForm.value.specification);
      formData.append('productPrice', this.productForm.value.price);
      formData.append('productQuantity', this.productForm.value.quantity);
      formData.append('category', this.selectedCategory);
      formData.append('subCategory', this.selectedSubcategory);

      // Track existing images to keep
      const existingImages = this.uploadedPhotos
        .filter((p) => p.isExisting)
        .map((p) => p.url);
      formData.append('existingImages', JSON.stringify(existingImages));

      // Add new images
      const newPhotos = this.uploadedPhotos.filter((p) => p.file);
      newPhotos.forEach((photo) => {
        if (photo.file) {
          formData.append('productImg', photo.file);
        }
      });

      // Send update request
      this.http
        .put<{ message: string; product: any }>(
          `http://localhost:3000/api/shop/update`,
          formData
        )
        .subscribe(
          (response) => {
            alert('Product updated successfully!');
            this.isEditing = false;

            // Instead of reloading the page, update the URL and product object with new data
            const updatedProduct = response.product;
            this.product = {
              _id: updatedProduct._id,
              id: updatedProduct._id,
              title: updatedProduct.productTitle,
              price: parseFloat(updatedProduct.productPrice),
              images: updatedProduct.productImg,
              brand: updatedProduct.productBrand,
              description: updatedProduct.productDesc,
              specification: updatedProduct.productSpec,
              quantity: parseInt(updatedProduct.productQuantity),
              category: updatedProduct.category,
              subcategory: updatedProduct.subCategory,
            };

            // Update URL with new product data
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: {
                _id: this.product._id,
                name: this.product.title,
                price: this.product.price,
                images: this.product.images.join(','),
                img: this.product.images[0],
                brand: this.product.brand,
                description: this.product.description,
                specification: this.product.specification,
                category: this.product.category,
                subcategory: this.product.subcategory,
                quantity: this.product.quantity,
              },
              queryParamsHandling: 'merge',
              replaceUrl: true,
            });
          },
          (error) => {
            console.error('Error updating product:', error);
            alert('Error updating product. Please try again.');
          }
        );
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
      this.message = '';
    }
  }

  increaseQuantity(): void {
    if (this.quantity < this.product.quantity) {
      this.quantity++;
      this.message = '';
    } else {
      this.message =
        'You have reached the maximum quantity available for this item';
    }
  }

  isProductInStock(): boolean {
    return this.product.quantity > 0;
  }

  addToCart(): void {
    if (!this.isLoggedIn()) {
      // Redirect to login page if not logged in
      alert('Please login first to sell items');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.isProductInStock()) {
      alert('Sorry, this item is out of stock.');
      return;
    }

    const cartItem: CartItem = {
      productImg: this.product.images[0],
      productTitle: this.product.title,
      quantity: this.quantity,
      price: this.product.price * this.quantity,
      shopProductId: this.product._id,
    };

    const userEmail =
      localStorage.getItem('email') || sessionStorage.getItem('email');

    if (userEmail) {
      this.cartService.addToCart(cartItem);
      console.log('Added to cart:', cartItem);
      alert(`${this.product.title} added to cart!`);
    } else {
      // This shouldn't happen if isLoggedIn() returns true, but just in case
      alert('Error: User email not found. Please log in again.');
      this.router.navigate(['/login']);
    }
  }

  getRatingStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  getCategoryLabel(category: string): string {
    // Match the categories from CommunityMarketComponent
    const mainCategories: { [key: string]: string } = {
      dog: 'Dog',
      cat: 'Cat',
      other: 'Other',
    };

    const subcategories: { [key: string]: string } = {
      accessories: 'Accessories',
      toys: 'Toys',
      clothes: 'Clothes',
    };

    return (
      mainCategories[category] ||
      subcategories[category] ||
      category ||
      'Not Specified'
    );
  }

  getSubcategoryLabel(subcategory: string): string {
    const subcategories: { [key: string]: string } = {
      accessories: 'Accessories',
      toys: 'Toys',
      clothes: 'Clothes',
    };
    return (
      subcategories[subcategory?.toLowerCase()] ||
      subcategory ||
      'Not Specified'
    );
  }

  isLoggedIn(): boolean {
    return (
      !!localStorage.getItem('authToken') ||
      !!sessionStorage.getItem('authToken')
    );
  }

  handleImageError(event: any) {
    event.target.src = 'assets/default-product-image.png'; // Replace with your default image path
  }

  previousImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  nextImage() {
    if (this.currentImageIndex < this.product.images.length - 1) {
      this.currentImageIndex++;
    }
  }
}
