import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../../backend/services/login.service';

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

  constructor(private router: Router, private loginService: LoginService) {}

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
          storage.setItem('address', response.user.address);
          this.router.navigate(['/home']).then(() => {
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
