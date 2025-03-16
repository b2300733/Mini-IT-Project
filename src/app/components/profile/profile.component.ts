import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { ProfileService } from '../../../../backend/services/profile.service';

interface Product {
  productImg: string[];
  productTitle: string;
  productPrice: number;
  username: string;
  userAvatar: string;
  condition: string;
  size?: string;
  category?: string;
  subCategory?: string;
  productDesc?: string;
  deliveryOpt?: string[];
  createdAt: string;
}

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
  errorPetMessage = '';
  errorAddPetMessage = '';
  selectedTab: string = 'account';
  userProducts: any[] = [];

  pets: {
    id: number;
    name: string;
    type: string;
    gender: string;
    saved: boolean;
    errorMessage?: string;
    originalData?: {
      name: string;
      type: string;
      gender: string;
    };
    hasChanges?: boolean;
  }[] = [
    {
      id: 1,
      name: '',
      type: '',
      gender: '',
      saved: false,
      errorMessage: '',
      hasChanges: false,
    },
  ];
  nextPetId = 2;

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

  ngOnInit(): void {
    this.getUserProduct();
  }

  getUserProduct(): void {
    if (!this.email) {
      console.error('User email not found in storage');
      return;
    }

    this.profileService.getListings(this.email).subscribe(
      (products) => {
        this.userProducts = products;
      },
      (error) => {
        console.error('Error fetching products', error);
      }
    );
  }

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

  calculateTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    now.setHours(now.getHours() + 8);
    const diffTime = Math.abs(now.getTime() - date.getTime());

    const diffSeconds = Math.floor(diffTime / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} days ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hours ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minutes ago`;
    } else {
      return `${diffSeconds} seconds ago`;
    }
  }

  navigateToProduct(product: Product) {
    this.router.navigate(['/product'], {
      queryParams: {
        name: product.productTitle,
        price: product.productPrice,
        condition: product.condition,
        img: product.productImg[0],
        user: product.username,
        avatar: product.userAvatar,
        description: product.productDesc,
        category: product.category,
        deliveryOptions: product.deliveryOpt?.join(','),
      },
    });
  }

  checkPetChanges(pet: any): void {
    if (!pet.originalData) {
      pet.hasChanges = !pet.saved; // If no original data, consider changed if not saved
      return;
    }

    pet.hasChanges =
      pet.name !== pet.originalData.name ||
      pet.type !== pet.originalData.type ||
      pet.gender !== pet.originalData.gender;
  }

  // Add listeners for input changes
  onPetInfoChange(pet: any): void {
    this.checkPetChanges(pet);
  }

  addPet(): void {
    // Check if the last pet in the array has all required fields filled
    const lastPet = this.pets[this.pets.length - 1];

    if (!lastPet.saved) {
      // If any field is empty, show an error message
      this.errorAddPetMessage = `Please save Pet ${lastPet.id} information before adding a new pet.`;

      return;
    }

    // Clear any previous error messages
    this.errorAddPetMessage = '';

    this.pets.push({
      id: this.nextPetId,
      name: '',
      type: '',
      gender: '',
      saved: false,
      errorMessage: '',
      hasChanges: false,
    });
    this.nextPetId++;
  }

  removePet(id: number): void {
    if (this.pets.length > 1) {
      this.pets = this.pets.filter((pet) => pet.id !== id);
      alert(`You have removed pet ${id}`);

      // Renumber the remaining pets sequentially
      this.pets = this.pets.map((pet, index) => {
        return {
          ...pet,
          id: index + 1,
        };
      });

      // Update nextPetId to be one more than the highest current ID
      this.nextPetId = this.pets.length + 1;
    } else {
      // If it's the last pet, just reset it instead of removing
      this.pets = [
        {
          id: 1,
          name: '',
          type: '',
          gender: '',
          saved: false,
          errorMessage: '',
        },
      ];
      this.nextPetId = 2;
    }
  }

  savePet(petId: number): void {
    const pet = this.pets.find((p) => p.id === petId);

    if (!pet) {
      return;
    }

    pet.errorMessage = '';

    // Trim whitespace from string fields to check if they're truly empty
    const petName = pet.name.trim();
    const petType = pet.type.trim();

    if (!petName || !petType || !pet.gender) {
      pet.errorMessage = 'Please fill in all required fields';
      return;
    }

    pet.name = petName;
    pet.type = petType;
    pet.saved = true;
    pet.hasChanges = false;

    // Store original data to detect future changes
    pet.originalData = {
      name: petName,
      type: petType,
      gender: pet.gender,
    };

    this.errorPetMessage = '';
    alert(`Pet ${petId} information saved successfully!`);
  }
}
