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
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';

  constructor(private router: Router, private signupService: SignupService) {}

  submit() {
    if (this.currentStep === 1 && this.validateFirstForm()) {
      this.checkUserExists();
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

  checkUserExists() {
    this.signupService.checkUserExists(this.username, this.email).subscribe(
      (response) => {
        this.currentStep++;
      },
      (error) => {
        this.errorMessage = 'Username or email already exists.';
      }
    );
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
        this.showAlert('success', 'Signup successful! 🎉');

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      (error) => {
        console.error('Error registering user', error);
        this.errorMessage = 'Failed to register user. Please try again.';
        this.showAlert('error', 'Signup failed! Please try again 😢');
      }
    );
  }

  showAlert(type: 'success' | 'error', message: string) {
    this.alertType = type;
    this.alertMessage = message;

    setTimeout(() => {
      this.alertMessage = '';
    }, 2000);
  }

  validateNumberInput(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
}
