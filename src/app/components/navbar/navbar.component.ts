import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  CartService,
  CartItem,
} from '../../../../backend/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  dropdownOpen = false;
  username =
    localStorage.getItem('username') || sessionStorage.getItem('username');
  avatar = localStorage.getItem('avatar') || sessionStorage.getItem('avatar');
  email = localStorage.getItem('email') || sessionStorage.getItem('email');
  gender = localStorage.getItem('gender') || sessionStorage.getItem('gender');
  contactNo =
    localStorage.getItem('contactNo') || sessionStorage.getItem('contactNo');
  address1 =
    localStorage.getItem('address1') || sessionStorage.getItem('address1');
  address2 =
    localStorage.getItem('address2') || sessionStorage.getItem('address2');
  city = localStorage.getItem('city') || sessionStorage.getItem('city');
  state = localStorage.getItem('state') || sessionStorage.getItem('state');
  country =
    localStorage.getItem('country') || sessionStorage.getItem('country');
  zip = localStorage.getItem('zip') || sessionStorage.getItem('zip');

  constructor(private router: Router, private cartService: CartService) {}
  cartItems: CartItem[] = [];

  ngOnInit(): void {
    document.addEventListener('click', this.handleClickOutside.bind(this));

    this.cartService.getCartItems().subscribe((items) => {
      this.cartItems = items;
    });

    // Set user email if logged in
    const email =
      localStorage.getItem('email') || sessionStorage.getItem('email');
    if (email) {
      this.cartService.setUserEmail(email);
    }
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    if (this.isLoggedIn()) {
      this.dropdownOpen = !this.dropdownOpen;
    }
  }

  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-menu')) {
      this.dropdownOpen = false;
    }
  }

  isLoggedIn(): boolean {
    return (
      !!localStorage.getItem('authToken') ||
      !!sessionStorage.getItem('authToken')
    );
  }

  isUserInfoComplete(): boolean {
    const username =
      (localStorage.getItem('username') ||
        sessionStorage.getItem('username')) ??
      '';
    const gender =
      (localStorage.getItem('gender') || sessionStorage.getItem('gender')) ??
      '';
    const contactNo =
      (localStorage.getItem('contactNo') ||
        sessionStorage.getItem('contactNo')) ??
      '';
    const address1 =
      (localStorage.getItem('address1') ||
        sessionStorage.getItem('address1')) ??
      '';
    const city =
      (localStorage.getItem('city') || sessionStorage.getItem('city')) ?? '';
    const state =
      (localStorage.getItem('state') || sessionStorage.getItem('state')) ?? '';
    const country =
      (localStorage.getItem('country') || sessionStorage.getItem('country')) ??
      '';
    const zip =
      (localStorage.getItem('zip') || sessionStorage.getItem('zip')) ?? '';

    return !!(
      username &&
      gender &&
      contactNo &&
      address1 &&
      city &&
      state &&
      country &&
      zip
    );
  }

  logout() {
    // Clear cart service user email to empty cart display
    this.cartService.clearUserEmail();

    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('avatar');
    localStorage.removeItem('email');
    localStorage.removeItem('gender');
    localStorage.removeItem('contactNo');
    localStorage.removeItem('address1');
    localStorage.removeItem('address2');
    localStorage.removeItem('city');
    localStorage.removeItem('state');
    localStorage.removeItem('country');
    localStorage.removeItem('zip');

    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('avatar');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('gender');
    sessionStorage.removeItem('contactNo');
    sessionStorage.removeItem('address1');
    sessionStorage.removeItem('address2');
    sessionStorage.removeItem('city');
    sessionStorage.removeItem('state');
    sessionStorage.removeItem('country');
    sessionStorage.removeItem('zip');
    this.dropdownOpen = false;
    this.router.navigate(['/login']);
  }

  getTotalItems(): number {
    return this.cartItems.length;
  }
}
