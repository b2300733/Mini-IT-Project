import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../../../../backend/services/profile.service';

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
  isLoading: boolean = false;

  constructor(private router: Router, private profileService: ProfileService) {}

  submit() {
    if (this.currentStep === 1 && this.validateForm1()) {
      this.isLoading = true;
      this.profileService.checkAccountType(this.email).subscribe(
        (response) => {
          if (response.isGoogleAccount) {
            this.isLoading = false;
            this.errorMessage =
              'This email is linked to Google authentication. Please use Google login.';
          } else {
            this.profileService.sendVerificationCode(this.email).subscribe(
              () => {
                this.isLoading = false;
                this.currentStep++;
                this.errorMessage = '';
                alert('Verification code has been resent to your email.');
              },
              (error) => {
                this.isLoading = false;
                this.errorMessage =
                  error.error.message ||
                  'Email not found or server error. Please try again.';
                console.error('Error sending verification code:', error);
              }
            );
          }
        },
        (error) => {
          this.isLoading = false;
          this.errorMessage =
            error.error.message ||
            'Email not found or server error. Please try again.';
          console.error('Error checking account type:', error);
        }
      );
    } else if (this.currentStep === 2 && this.validateForm2()) {
      this.isLoading = true;
      this.profileService.verifyCode(this.email, this.code).subscribe(
        () => {
          this.isLoading = false;
          this.currentStep++;
          this.errorMessage = '';
        },
        (error) => {
          this.isLoading = false;
          this.errorMessage =
            error.error.message ||
            'Invalid verification code. Please try again.';
          console.error('Error verifying code:', error);
        }
      );
    } else if (this.currentStep === 3 && this.validateForm3()) {
      this.isLoading = true;
      this.profileService
        .resetPassword(this.email, this.code, this.password)
        .subscribe(
          () => {
            this.isLoading = false;
            alert(
              'Password reset successful! Please login with your new password.'
            );
            this.router.navigate(['/login']);
          },
          (error) => {
            this.isLoading = false;
            this.errorMessage =
              error.error.message ||
              'Invalid verification code or server error. Please try again.';
            console.error('Error resetting password:', error);
          }
        );
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      if (this.currentStep === 3) {
        this.password = '';
        this.confirmPassword = '';
      } else if (this.currentStep === 2) {
        this.code = '';
      }

      this.currentStep--;
      this.errorMessage = '';
    }
  }

  validateForm1(): boolean {
    if (!this.email) {
      this.errorMessage = 'Please fill enter your email.';
      return false;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return false;
    }

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

    return true;
  }

  resendCode(): void {
    this.isLoading = true;
    this.profileService.sendVerificationCode(this.email).subscribe(
      () => {
        this.isLoading = false;
        alert('Verification code has been resent to your email.');
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage =
          'Failed to resend verification code. Please try again.';
        console.error('Error resending verification code:', error);
      }
    );
  }
}
