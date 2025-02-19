import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgotpassword',
  standalone: false,
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.css',
})
export class ForgotpasswordComponent {
  currentStep: number = 1;
  email = '';
  code = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';

  constructor(private router: Router) {}

  submit() {
    if (this.currentStep === 1 && this.validateForm1()) {
      this.currentStep++;
    } else if (this.currentStep === 2 && this.validateForm2()) {
      this.currentStep++;
    } else if (this.currentStep === 3 && this.validateForm3()) {
      console.log('Reset password successfully');
      this.router.navigate(['/login']);
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  validateForm1(): boolean {
    if (!this.email) {
      this.errorMessage = 'Please fill enter your email.';
      return false;
    }
    this.errorMessage = '';
    return true;
  }
  validateForm2(): boolean {
    if (!this.code) {
      this.errorMessage = 'Please enter the code from your email.';
      return false;
    }
    this.errorMessage = '';
    return true;
  }

  validateForm3(): boolean {
    if (!this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in your new password and confirm it.';
      return false;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return false;
    }
    this.errorMessage = '';
    return true;
  }
}
