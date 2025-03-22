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
  address1 = '';
  address2 = '';
  city = '';
  state = '';
  country = '';
  zip = '';
  termsAccepted = false;
  errorMessage = '';
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';
  invalidFields: Set<string> = new Set();
  passwordMismatch = false;
  emailExists = false;

  constructor(private router: Router, private signupService: SignupService) {}

  submit() {
    if (this.currentStep === 1) {
      this.checkFirstFormFields();
      if (this.validateFirstForm()) {
        this.checkUserExists();
      }
    } else if (this.currentStep === 2) {
      this.checkSecondFormFields();
      if (this.validateSecondForm()) {
        this.registerUser();
      }
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  checkFirstFormFields() {
    this.invalidFields.clear();

    if (!this.username) {
      this.invalidFields.add('username');
    }
    if (!this.email) {
      this.invalidFields.add('email');
    }
    if (!this.password) {
      this.invalidFields.add('password');
    }
    if (!this.confirmPassword) {
      this.invalidFields.add('confirmPassword');
    }

    this.passwordMismatch =
      this.password !== this.confirmPassword &&
      Boolean(this.password) &&
      Boolean(this.confirmPassword);
  }

  checkSecondFormFields() {
    this.invalidFields.clear();

    if (!this.gender) {
      this.invalidFields.add('gender');
    }
    if (!this.contactNo) {
      this.invalidFields.add('contactNo');
    }
    if (!this.address1) {
      this.invalidFields.add('address1');
    }
    if (!this.city) {
      this.invalidFields.add('city');
    }
    if (!this.state) {
      this.invalidFields.add('state');
    }
    if (!this.country) {
      this.invalidFields.add('country');
    }
    if (!this.zip) {
      this.invalidFields.add('zip');
    }
    if (!this.termsAccepted) {
      this.invalidFields.add('termsAccepted');
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    return this.invalidFields.has(fieldName);
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
      this.passwordMismatch = true;
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
      !this.address1 ||
      !this.city ||
      !this.state ||
      !this.country ||
      !this.zip ||
      !this.termsAccepted
    ) {
      this.errorMessage = 'Please fill in all the fields and accept the terms.';
      return false;
    }
    this.errorMessage = '';
    return true;
  }

  checkUserExists() {
    this.emailExists = false;
    this.signupService.checkUserExists(this.email).subscribe(
      (response) => {
        this.currentStep++;
      },
      (error) => {
        this.emailExists = true;
        this.errorMessage = 'Email already exists.';
      }
    );
  }

  registerUser() {
    const user = {
      username: this.username,
      email: this.email,
      password: this.password,
      gender: this.gender,
      contactNo: this.contactNo,
      address1: this.address1,
      address2: this.address2,
      city: this.city,
      state: this.state,
      country: this.country,
      zip: this.zip,
      termsAccepted: this.termsAccepted,
    };

    this.signupService.signup(user).subscribe(
      (response) => {
        console.log('User registered successfully', response);
        this.showAlert('success', 'Signup successful! 🎉');

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 800);
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
    }, 1500);
  }

  validateNumberInput(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
}
