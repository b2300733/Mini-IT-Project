import { Component, OnInit } from '@angular/core';
import {
  JobsService,
  JobsListing,
} from '../../../../backend/services/jobs.service';
import { CommunitymarketService } from '../../../../backend/services/communitymarket.service';
import { ShopService } from '../../../../backend/services/shop.service';
import { Router } from '@angular/router';
import {
  CartService,
  CartItem,
} from '../../../../backend/services/cart.service';

interface ShopProduct {
  _id: string;
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

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  // Services
  featuredServices: JobsListing[] = [];
  isServicesLoading: boolean = true;
  serviceError: string | null = null;

  // Community market
  featuredMarketItems: any[] = [];
  isMarketLoading: boolean = true;
  marketError: string | null = null;

  // Shop products
  featuredShopItems: ShopProduct[] = [];
  isShopLoading: boolean = true;
  shopError: string | null = null;

  // User
  userEmail: string = '';

  constructor(
    private router: Router,
    private jobsService: JobsService,
    private communitymarketService: CommunitymarketService,
    private shopService: ShopService,
    private cartService: CartService
  ) {
    // Get user email from storage
    this.userEmail =
      localStorage.getItem('email') || sessionStorage.getItem('email') || '';
  }

  ngOnInit(): void {
    this.loadFeaturedServices();
    this.loadFeaturedMarketItems();
    this.loadFeaturedShopItems();
  }

  loadFeaturedServices(): void {
    this.isServicesLoading = true;
    this.serviceError = null;

    this.jobsService.getAllJobs().subscribe({
      next: (jobs) => {
        // Get latest 3 jobs
        this.featuredServices = jobs.slice(0, 3);
        this.isServicesLoading = false;
      },
      error: (err) => {
        console.error('Error loading services:', err);
        this.serviceError = 'Failed to load services. Please try again.';
        this.isServicesLoading = false;
      },
    });
  }

  loadFeaturedMarketItems(): void {
    this.isMarketLoading = true;
    this.marketError = null;

    this.communitymarketService.getProducts().subscribe({
      // Changed from getAllListings to getProducts to match your service
      next: (items) => {
        // Get latest 4 marketplace items
        this.featuredMarketItems = items.slice(0, 4);
        this.isMarketLoading = false;
      },
      error: (err) => {
        console.error('Error loading market items:', err);
        this.marketError =
          'Failed to load marketplace items. Please try again.';
        this.isMarketLoading = false;
      },
    });
  }

  loadFeaturedShopItems(): void {
    this.isShopLoading = true;
    this.shopError = null;

    this.shopService.getProducts().subscribe({
      next: (products: ShopProduct[]) => {
        // Get the latest 4 shop products
        this.featuredShopItems = products.slice(0, 4);
        console.log('Featured Shop Items:', this.featuredShopItems); // Debugging
        this.isShopLoading = false;
      },
      error: (err) => {
        console.error('Error loading shop items:', err);
        this.shopError = 'Failed to load shop products. Please try again.';
        this.isShopLoading = false;
      },
    });
  }

  addToCart(product: ShopProduct, event?: Event): void {
    // Prevent navigation to product page if clicked on Add to Cart
    if (event) {
      event.stopPropagation();
    }

    // Check if user is logged in
    if (!this.isLoggedIn()) {
      alert('Please login first to add items to cart');
      this.router.navigate(['/login']);
      return;
    }

    const cartItem: CartItem = {
      productImg: product.productImg?.[0],
      productTitle: product.productTitle,
      quantity: 1,
      price: product.productPrice,
      shopProductId: product._id,
    };

    this.cartService.addToCart(cartItem);
    alert(`${product.productTitle} added to cart!`);
  }

  addMarketItemToCart(item: any, event?: Event): void {
    // Prevent navigation to product page if clicked on Add to Cart
    if (event) {
      event.stopPropagation();
    }

    // Check if user is logged in
    if (!this.isLoggedIn()) {
      alert('Please login first to add items to cart');
      this.router.navigate(['/login']);
      return;
    }

    const cartItem: CartItem = {
      productImg: item.productImg?.[0],
      productTitle: item.productTitle,
      quantity: 1,
      price: parseFloat(item.productPrice),
      productId: item._id,
    };

    this.cartService.addToCart(cartItem);
    alert(`${item.productTitle} added to cart!`);
  }

  viewProductDetails(item: any): void {
    console.log('Navigating to product details:', item._id);
    this.communitymarketService.getProductById(item._id).subscribe({
      next: (productDetails) => {
        // Navigate to the product component with all required details
        this.router.navigate(['/product'], {
          queryParams: {
            _id: productDetails._id,
            name: productDetails.productTitle,
            price: productDetails.productPrice,
            quantity: productDetails.productQuantity,
            condition: productDetails.condition,
            images: productDetails.productImg?.join(',') || '',
            img: productDetails.productImg?.[0] || '',
            user: productDetails.username || '',
            email: productDetails.userEmail,
            avatar: productDetails.userAvatar || '',
            description: productDetails.productDesc || '',
            category: productDetails.category || '',
            subcategory: productDetails.subCategory || '',
            deliveryOptions: productDetails.deliveryOpt?.join(',') || '',
          },
        });
      },
      error: (err) => {
        console.error('Error fetching product details:', err);
        alert('Error loading product details.');
      },
    });
  }

  viewShopProductDetails(product: ShopProduct): void {
    console.log('Navigating to shop product details:', product._id);

    // Navigate to the shop-product component with all required details
    this.router.navigate(['/shop-product'], {
      queryParams: {
        _id: product._id,
        name: product.productTitle,
        price: product.productPrice,
        quantity: product.productQuantity,
        images: product.productImg?.join(',') || '',
        img: product.productImg?.[0] || '',
        brand: product.productBrand || '',
        description: product.productDesc || '',
        specification: product.productSpec || '',
        category: product.category || '',
        subcategory: product.subCategory || '',
      },
    });
  }

  navigateToCommunityMarket(): void {
    console.log('Navigating to community market');
    this.router.navigate(['/market']);
  }

  editMarketItem(item: any, event?: Event): void {
    // Prevent event bubbling if event is provided
    if (event) {
      event.stopPropagation();
    }

    // Check if user is logged in
    if (!this.isLoggedIn()) {
      alert('Please login first to edit your items');
      this.router.navigate(['/login']);
      return;
    }

    // Verify user is the owner
    if (item.userEmail !== this.userEmail) {
      alert('You can only edit your own items');
      return;
    }

    // Navigate to edit product page with product ID
    console.log('Editing product with ID:', item._id);
    this.router.navigate(['/edit-product'], {
      queryParams: {
        id: item._id,
      },
    });
  }

  navigateToShop(): void {
    console.log('Navigating to shop');
    this.router.navigate(['/products']);
  }

  isLoggedIn(): boolean {
    return (
      !!localStorage.getItem('authToken') ||
      !!sessionStorage.getItem('authToken')
    );
  }

  calculateTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());

    const diffSeconds = Math.floor(diffTime / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return 'Just now';
    }
  }

  // Price formatting utility method
  formatPrice(price: any): string {
    // Convert to number and format to 2 decimal places
    return parseFloat(price).toFixed(2);
  }

  handleSignupClick(event: Event): void {
    event.preventDefault();

    if (this.isLoggedIn()) {
      alert('You are already logged in.');
    } else {
      this.router.navigate(['/signup']);
    }
  }

  navigateToProfileServiceListings(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/profile'], {
      queryParams: { tab: 'serviceListings' },
    });
  }
}
