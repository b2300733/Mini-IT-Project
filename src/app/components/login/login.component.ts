import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../../backend/services/login.service';
import { CartService } from '../../../../backend/services/cart.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = '';
  password = '';
  rememberMe = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private cartService: CartService
  ) {}

  submit() {
    if (this.validateForm()) {
      this.loginService.login(this.email, this.password).subscribe(
        (response) => {
          console.log('Login successful', response);
          const storage = this.rememberMe ? localStorage : sessionStorage;
          storage.setItem('authToken', response.token);
          storage.setItem('username', response.user.username);
          storage.setItem('avatar', response.user.avatar);
          storage.setItem('email', response.user.email);
          storage.setItem('gender', response.user.gender);
          storage.setItem('contactNo', response.user.contactNo);
          storage.setItem('address1', response.user.address1);
          storage.setItem('address2', response.user.address2);
          storage.setItem('city', response.user.city);
          storage.setItem('state', response.user.state);
          storage.setItem('country', response.user.country);
          storage.setItem('zip', response.user.zip);
          this.cartService.setUserEmail(response.user.email);
          this.router.navigate(['/profile']).then(() => {
            window.location.reload();
          });
        },
        (error) => {
          console.error('Login failed', error);
          this.errorMessage = 'Invalid email or password.';
        }
      );
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

  // facebookLogin() {
  //   window.location.href = 'http://localhost:3000/auth/facebook';
  // }

  googleLogin() {
    window.location.href = 'http://localhost:3000/auth/google';
  }
}
