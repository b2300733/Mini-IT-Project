import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router) {}

  submit() {
    if (this.validateForm()) {
      console.log('Form submitted successfully');
      this.router.navigate(['/home']);
    }
  }

  validateForm(): boolean {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in your username and password.';
      return false;
    }
    this.errorMessage = '';
    return true;
  }
}
