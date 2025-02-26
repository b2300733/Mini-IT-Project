import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
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
  errorMessage = '';
  selectedTab: string = 'account';

  username =
    (localStorage.getItem('username') || sessionStorage.getItem('username')) ??
    '';
  avatar =
    (localStorage.getItem('avatar') || sessionStorage.getItem('avatar')) ?? '';
  email =
    (localStorage.getItem('email') || sessionStorage.getItem('email')) ?? '';
  gender =
    (localStorage.getItem('gender') || sessionStorage.getItem('gender')) ?? '';
  contactNo =
    (localStorage.getItem('contactNo') ||
      sessionStorage.getItem('contactNo')) ??
    '';
  address1 =
    (localStorage.getItem('address1') || sessionStorage.getItem('address1')) ??
    '';
  address2 =
    (localStorage.getItem('address2') || sessionStorage.getItem('address2')) ??
    '';
  city = (localStorage.getItem('city') || sessionStorage.getItem('city')) ?? '';
  state =
    (localStorage.getItem('state') || sessionStorage.getItem('state')) ?? '';
  country =
    (localStorage.getItem('country') || sessionStorage.getItem('country')) ??
    '';
  zip = (localStorage.getItem('zip') || sessionStorage.getItem('zip')) ?? '';

  authToken =
    localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

  constructor(private profileService: ProfileService, private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (!this.isFormValid()) {
          alert('Please complete your profile before doing other action.');
          this.router.navigate(['/profile']); // Prevent navigation
        }
      }
    });
    this.authToken = this.authToken === 'undefined' ? null : this.authToken;
  }

  // isStorageValid(): boolean {
  //   const username =
  //     localStorage.getItem('username') ||
  //     sessionStorage.getItem('username') ||
  //     '';
  //   const gender =
  //     localStorage.getItem('gender') || sessionStorage.getItem('gender') || '';
  //   const contactNo =
  //     localStorage.getItem('contactNo') ||
  //     sessionStorage.getItem('contactNo') ||
  //     '';
  //   const address1 =
  //     localStorage.getItem('address1') ||
  //     sessionStorage.getItem('address1') ||
  //     '';

  //   return (
  //     username.trim() !== '' &&
  //     gender.trim() !== '' &&
  //     contactNo.trim() !== '' &&
  //     address1.trim() !== ''
  //   );
  // }

  isFormValid(): boolean {
    return (
      this.username.trim() !== '' &&
      this.gender.trim() !== '' &&
      this.contactNo.trim() !== '' &&
      this.address1.trim() !== '' &&
      this.city.trim() !== '' &&
      this.state.trim() !== '' &&
      this.country.trim() !== '' &&
      this.zip.trim() !== ''
    );
  }

  saveProfile(): void {
    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const updatedData = {
      username: this.username,
      gender: this.gender,
      contactNo: this.contactNo,
      address1: this.address1,
      address2: this.address2,
      city: this.city,
      state: this.state,
      country: this.country,
      zip: this.zip,
      avatar: this.avatar,
    };

    this.profileService.updateProfile(this.email, updatedData).subscribe(
      (response) => {
        // Update local storage/session storage
        localStorage.setItem('username', this.username);
        localStorage.setItem('gender', this.gender);
        localStorage.setItem('contactNo', this.contactNo);
        localStorage.setItem('address1', this.address1);
        localStorage.setItem('address2', this.address2);
        localStorage.setItem('city', this.city);
        localStorage.setItem('state', this.state);
        localStorage.setItem('country', this.country);
        localStorage.setItem('zip', this.zip);
        localStorage.setItem('avatar', this.avatar);

        sessionStorage.setItem('username', this.username);
        sessionStorage.setItem('gender', this.gender);
        sessionStorage.setItem('contactNo', this.contactNo);
        sessionStorage.setItem('address1', this.address1);
        sessionStorage.setItem('address2', this.address2);
        sessionStorage.setItem('city', this.city);
        sessionStorage.setItem('state', this.state);
        sessionStorage.setItem('country', this.country);
        sessionStorage.setItem('zip', this.zip);
        sessionStorage.setItem('avatar', this.avatar);

        alert('Profile saved successfully!');
        window.location.reload();
      },
      (error) => {
        this.errorMessage = 'Failed to update profile. Please try again.';
        console.error('Profile update error:', error);
      }
    );
  }

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

  onImageSelected(event: any): void {
    const file = event.target.files[0];

    if (file && file.size > 100 * 1024) {
      alert('File size exceeds 100KB! Please upload a smaller file.');
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatar = e.target.result; // Update preview
      };
      reader.readAsDataURL(file);
    }
  }
}
