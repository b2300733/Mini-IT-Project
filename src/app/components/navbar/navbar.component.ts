import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  address =
    localStorage.getItem('address') || sessionStorage.getItem('address');
  constructor(private router: Router) {}

  ngOnInit() {
    document.addEventListener('click', this.handleClickOutside.bind(this));
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
    const address =
      (localStorage.getItem('address') || sessionStorage.getItem('address')) ??
      '';

    return !!(username && gender && contactNo && address);
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('avatar');
    localStorage.removeItem('email');
    localStorage.removeItem('gender');
    localStorage.removeItem('contactNo');
    localStorage.removeItem('address');

    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('avatar');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('gender');
    sessionStorage.removeItem('contactNo');
    sessionStorage.removeItem('address');
    this.dropdownOpen = false;
    this.router.navigate(['/login']);
  }
}
