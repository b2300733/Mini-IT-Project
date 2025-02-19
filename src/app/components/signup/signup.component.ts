import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  currentStep: number = 1;
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  gender = '';
  contactNo = '';
  address = '';
  termsAccepted = false;
  errorMessage = '';

  constructor(private router: Router) {}

  nextStep() {
    if (this.currentStep === 1 && this.validateFirstForm()) {
      this.currentStep++;
    } else if (this.currentStep === 2 && this.validateSecondForm()) {
      console.log('Form submitted successfully');
      this.router.navigate(['/login']);
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  validateFirstForm(): boolean {
    if (
      !this.username ||
      !this.email ||
      !this.password ||
      !this.confirmPassword
    ) {
      this.errorMessage = 'Please fill in all the fields.';
      return false;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return false;
    }
    this.errorMessage = '';
    return true;
  }

  validateSecondForm(): boolean {
    if (
      !this.gender ||
      !this.contactNo ||
      !this.address ||
      !this.termsAccepted
    ) {
      this.errorMessage = 'Please fill in all the fields and accept the terms.';
      return false;
    }
    this.errorMessage = '';
    return true;
  }
}
