import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SignupService } from '../../../../backend/services/signup.service';

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

  constructor(private router: Router, private signupService: SignupService) {}

  submit() {
    if (this.currentStep === 1 && this.validateFirstForm()) {
      this.currentStep++;
    } else if (this.currentStep === 2 && this.validateSecondForm()) {
      this.registerUser();
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

  registerUser() {
    const user = {
      username: this.username,
      email: this.email,
      password: this.password,
      contactNumber: this.contactNo,
      address: this.address,
      gender: this.gender,
    };

    this.signupService.signup(user).subscribe(
      (response) => {
        console.log('User registered successfully', response);
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error registering user', error);
        this.errorMessage = 'Failed to register user. Please try again.';
      }
    );
  }
}
