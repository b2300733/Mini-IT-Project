import { Component } from '@angular/core';
import { ProfileService } from '../../../../backend/services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  showChangePasswordModal = false;
  verificationCode = '';
  newPassword = '';

  username =
    localStorage.getItem('username') || sessionStorage.getItem('username');
  avatar = localStorage.getItem('avatar') || sessionStorage.getItem('avatar');
  email =
    (localStorage.getItem('email') || sessionStorage.getItem('email')) ?? '';
  gender = localStorage.getItem('gender') || sessionStorage.getItem('gender');
  contactNo =
    localStorage.getItem('contactNo') || sessionStorage.getItem('contactNo');
  address =
    localStorage.getItem('address') || sessionStorage.getItem('address');

  constructor(private profileService: ProfileService) {}

  openChangePasswordModal(): void {
    this.showChangePasswordModal = true;
    this.sendVerificationCode();
  }

  closeChangePasswordModal(): void {
    this.showChangePasswordModal = false;
    this.verificationCode = '';
    this.newPassword = '';
  }

  sendVerificationCode(): void {
    this.profileService.sendVerificationCode(this.email).subscribe(
      () => alert('Verification code sent to your email!'),
      (error) => {
        console.error('Error sending verification code:', error);
        alert('Failed to send verification code.');
      }
    );
  }

  verifyCode(): void {
    this.profileService
      .resetPassword(this.email, this.verificationCode, this.newPassword)
      .subscribe(
        (response) => {
          alert('Password changed successfully!');
          this.closeChangePasswordModal();
        },
        (error) => {
          alert('Invalid code. Please try again.');
        }
      );
  }
}
