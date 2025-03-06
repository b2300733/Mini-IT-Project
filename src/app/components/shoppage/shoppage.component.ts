import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

interface ShopProduct {
  id: string;
  img: string;
  name: string;
  price: number;
  brand: string;
  condition: string;
  category?: string;
  subcategory?: string;
  weight?: string;
  description?: string;
  details?: string[];
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

  products: ShopProduct[] = [
    {
      id: '1',
      img: '/catlitterbox.jpg',
      name: 'Cat Litter Box',
      price: 29.99,
      brand: 'PetCo',
      condition: 'New',
      category: 'cat',
      subcategory: 'accessories',
      weight: '2kg',
      description: 'High-quality cat litter box with odor control system',
      details: ['Easy to clean', 'Odor control system', 'Durable material'],
    },
    {
      id: '2',
      img: '/dogfood.jpg',
      name: 'Dog Food',
      price: 49.99,
      brand: 'PetCo',
      condition: 'New',
      category: 'dog',
      subcategory: 'beds',
      weight: '3kg',
      description: 'Premium dog food for all breeds and sizes',
      details: [
        'High-quality ingredients',
        'Suitable for all breeds',
        'Easy to digest',
      ],
    },
    // Add more products as needed
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

  private originalProducts: ShopProduct[] = [...this.products];

  constructor(private router: Router) {}

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
        this.activeSubcategories.includes(product.subcategory || '')
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
          this.activeSubcategories.includes(product.subcategory || '')
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
            this.activeSubcategories.includes(product.subcategory || '')
          );
        });
      } else {
        this.products = [...this.originalProducts];
      }
    } else {
      this.products = this.originalProducts.filter((product: ShopProduct) => {
        const matchesSearch = product.name.toLowerCase().includes(query);

        if (this.activeCategory && this.activeSubcategories.length > 0) {
          return (
            matchesSearch &&
            product.category === this.activeCategory &&
            this.activeSubcategories.includes(product.subcategory || '')
          );
        }

        return matchesSearch;
      });
    }
  }

  navigateToProduct(product: ShopProduct) {
    this.router.navigate(['/shop-product'], {
      queryParams: {
        id: product.id,
        name: product.name,
        price: product.price,
        condition: product.condition,
        img: product.img, // Pass the full image path
        brand: product.brand,
        category: product.category,
        weight: product.weight || '1kg',
        description:
          product.description ||
          'High-quality pet product perfect for your furry friend.',
        details: (
          product.details || [
            'Premium quality',
            'Durable material',
            'Easy to clean',
          ]
        ).join(','),
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
}
