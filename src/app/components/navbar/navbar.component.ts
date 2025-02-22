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

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('avatar');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('avatar');
    this.dropdownOpen = false;
    this.router.navigate(['/login']);
  }
}
