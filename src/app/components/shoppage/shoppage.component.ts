import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Product {
  id: string;
  img: string;
  name: string;
  price: number;
  brand: string;
  condition: string;
  category?: string;
  subcategory?: string;
}

@Component({
  selector: 'app-shoppage',
  standalone: false,
  templateUrl: './shoppage.component.html',
  styleUrls: ['./shoppage.component.css']
})
export class ShoppageComponent {
  isDogExpanded = false;
  isCatExpanded = false;
  isOtherExpanded = false;
  activeCategory: string | null = null;
  activeSubcategories: string[] = [];
  searchQuery: string = '';

  products: Product[] = [
    { id: '1', img: '/catlitterbox.jpg', name: 'Cat Litter Box', price: 29.99, brand: 'PetCo', condition: 'New', category: 'cat', subcategory: 'accessories' },
    { id: '2', img: '/dogfood.jpg', name: 'Dog Food', price: 89.99, brand: 'PawPerfect', condition: 'New', category: 'dog', subcategory: 'accessories' },
    // Add more products as needed
  ];

  private originalProducts: Product[] = [...this.products];

  constructor(private router: Router) {}

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
    this.isDogExpanded = false;
    this.isCatExpanded = false;
    this.isOtherExpanded = false;
    
    this.activeCategory = category;
    
    if (!this.activeSubcategories.includes(subcategory)) {
      this.activeSubcategories.push(subcategory);
    }

    this.products = this.originalProducts.filter((product: Product) => {
      return product.category === category && 
             this.activeSubcategories.includes(product.subcategory || '');
    });
  }

  clearFilters() {
    this.activeCategory = null;
    this.activeSubcategories = [];
    this.products = [...this.originalProducts];
  }

  removeSubcategory(subcategory: string) {
    this.activeSubcategories = this.activeSubcategories.filter(s => s !== subcategory);
    
    if (this.activeSubcategories.length === 0) {
      this.clearFilters();
    } else {
      this.products = this.originalProducts.filter((product: Product) => {
        return product.category === this.activeCategory && 
               this.activeSubcategories.includes(product.subcategory || '');
      });
    }
  }

  searchProducts(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery = query;
    
    if (query === '') {
      if (this.activeCategory && this.activeSubcategories.length > 0) {
        this.products = this.originalProducts.filter((product: Product) => {
          return product.category === this.activeCategory && 
                 this.activeSubcategories.includes(product.subcategory || '');
        });
      } else {
        this.products = [...this.originalProducts];
      }
    } else {
      this.products = this.originalProducts.filter((product: Product) => {
        const matchesSearch = product.name.toLowerCase().includes(query);
        
        if (this.activeCategory && this.activeSubcategories.length > 0) {
          return matchesSearch && 
                 product.category === this.activeCategory && 
                 this.activeSubcategories.includes(product.subcategory || '');
        }
        
        return matchesSearch;
      });
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
        brand: product.brand,
        category: product.category,
      }
    });
  }
}