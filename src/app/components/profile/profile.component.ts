import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../../../backend/services/profile.service';

interface Product {
  _id: string;
  productImg: string[];
  productTitle: string;
  productPrice: number;
  productQuantity: number;
  username: string;
  userEmail: string;
  userAvatar: string;
  condition: string;
  size?: string;
  category?: string;
  subCategory?: string;
  productDesc?: string;
  deliveryOpt?: string[];
  createdAt: string;
}

interface HistoryItem {
  productImg: string;
  productTitle: string;
  quantity: number;
  price: number;
  productId?: string;
  shopProductId?: string;
}

interface PurchaseHistory {
  _id: string;
  items: HistoryItem[];
  totalAmount: number;
  purchaseDate: Date;
  status: string;
  userDetails?: {
    email?: string;
    contactNo?: number;
    address?: string;
  };
}

interface SalesItem {
  productId: string;
  productTitle: string;
  productImg: string;
  quantity: number;
  price: number;
  purchaseDate: Date;
  status: string;
  buyer: {
    email: string;
    contactNo: string;
    address: string;
  };
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
  invalidFields: Set<string> = new Set();
  originalAccountData: {
    username: string;
    avatar: string;
    gender: string;
    contactNo: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  } | null = null;
  accountSaved = false;
  accountHasChanges = false;
  pets: {
    _id?: string;
    id: number;
    name: string;
    breed: string;
    gender: string;
    saved: boolean;
    errorMessage?: string;
    originalData?: {
      name: string;
      breed: string;
      gender: string;
    };
    hasChanges?: boolean;
    createdAt?: Date;
  }[] = [
    {
      id: 1,
      name: '',
      breed: '',
      gender: '',
      saved: false,
      errorMessage: '',
      hasChanges: false,
    },
  ];
  nextPetId = 2;
  purchaseHistory: PurchaseHistory[] = [];
  historyFilter: string = 'all';
  filteredPurchaseHistory: PurchaseHistory[] = [];

  malaysiaStates: string[] = [
    'Johor',
    'Kedah',
    'Kelantan',
    'Kuala Lumpur',
    'Labuan',
    'Melaka',
    'Negeri Sembilan',
    'Pahang',
    'Penang',
    'Perak',
    'Perlis',
    'Putrajaya',
    'Sabah',
    'Sarawak',
    'Selangor',
    'Terengganu',
  ];

  malaysianCities: { [state: string]: string[] } = {
    Johor: [
      'Johor Bahru',
      'Batu Pahat',
      'Muar',
      'Kluang',
      'Segamat',
      'Pontian',
      'Kota Tinggi',
      'Kulai',
      'Pasir Gudang',
      'Iskandar Puteri',
    ],
    Kedah: [
      'Alor Setar',
      'Sungai Petani',
      'Kulim',
      'Langkawi',
      'Kubang Pasu',
      'Baling',
      'Pendang',
      'Yan',
      'Pokok Sena',
      'Bandar Baharu',
    ],
    Kelantan: [
      'Kota Bharu',
      'Pasir Mas',
      'Tumpat',
      'Pasir Puteh',
      'Bachok',
      'Kuala Krai',
      'Machang',
      'Tanah Merah',
      'Jeli',
      'Gua Musang',
    ],
    'Kuala Lumpur': [
      'Kuala Lumpur',
      'Wangsa Maju',
      'Batu',
      'Kepong',
      'Cheras',
      'Titiwangsa',
      'Setiawangsa',
      'Bukit Bintang',
      'Lembah Pantai',
      'Seputeh',
      'Bandar Tun Razak',
    ],
    Labuan: ['Labuan', 'Victoria'],
    Melaka: [
      'Melaka City',
      'Alor Gajah',
      'Jasin',
      'Masjid Tanah',
      'Merlimau',
      'Ayer Keroh',
    ],
    'Negeri Sembilan': [
      'Seremban',
      'Port Dickson',
      'Nilai',
      'Bahau',
      'Rembau',
      'Kuala Pilah',
      'Tampin',
      'Jempol',
    ],
    Pahang: [
      'Kuantan',
      'Temerloh',
      'Bentong',
      'Mentakab',
      'Raub',
      'Jerantut',
      'Pekan',
      'Cameron Highlands',
      'Rompin',
      'Maran',
      'Lipis',
    ],
    Penang: [
      'George Town',
      'Butterworth',
      'Bukit Mertajam',
      'Nibong Tebal',
      'Balik Pulau',
      'Kepala Batas',
      'Air Itam',
      'Bayan Lepas',
      'Seberang Perai',
    ],
    Perak: [
      'Ipoh',
      'Taiping',
      'Teluk Intan',
      'Batu Gajah',
      'Sitiawan',
      'Manjung',
      'Kuala Kangsar',
      'Kampar',
      'Tapah',
      'Bidor',
      'Parit Buntar',
      'Lumut',
    ],
    Perlis: ['Kangar', 'Arau', 'Padang Besar', 'Kuala Perlis'],
    Putrajaya: ['Putrajaya'],
    Sabah: [
      'Kota Kinabalu',
      'Sandakan',
      'Tawau',
      'Lahad Datu',
      'Keningau',
      'Semporna',
      'Kudat',
      'Beaufort',
      'Papar',
      'Ranau',
      'Kunak',
      'Kota Belud',
    ],
    Sarawak: [
      'Kuching',
      'Miri',
      'Sibu',
      'Bintulu',
      'Limbang',
      'Sarikei',
      'Sri Aman',
      'Kapit',
      'Samarahan',
      'Marudi',
      'Bau',
      'Serian',
    ],
    Selangor: [
      'Shah Alam',
      'Petaling Jaya',
      'Klang',
      'Subang Jaya',
      'Ampang Jaya',
      'Kajang',
      'Selayang',
      'Rawang',
      'Sepang',
      'Hulu Selangor',
      'Kuala Selangor',
      'Sabak Bernam',
    ],
    Terengganu: [
      'Kuala Terengganu',
      'Kemaman',
      'Dungun',
      'Besut',
      'Marang',
      'Hulu Terengganu',
      'Setiu',
    ],
  };

  filteredCities: string[] = [];

  salesHistory: SalesItem[] = [];
  filteredSalesHistory: SalesItem[] = [];
  salesFilter: string = 'all';
  isLoadingSales: boolean = false;

  userServices: any[] = [];

  // Analysis properties
  analysisPeriod: string = 'all';
  analysisPeriodLabel: string = 'All Time';
  isLoadingAnalysis: boolean = false;

  // Summary metrics
  totalSalesCount: number = 0;
  totalRevenue: number = 0;
  netIncome: number = 0;
  commissionPaid: number = 0;
  salesGrowth: number = 0;
  revenueGrowth: number = 0;

  // Sales by status
  statusCounts: { [key: string]: number } = {
    Completed: 0,
    Processing: 0,
    Cancelled: 0,
  };

  topProducts: { title: string; unitsSold: number; revenue: number }[] = [];
  averageOrderValue: number = 0;
  inventoryValue: number = 0;
  totalInventoryItems: number = 0;

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

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private route: ActivatedRoute
  ) {
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
    this.getPurchaseHistory();
    this.getUserPets();
    this.getSalesHistory();
    this.getUserServices();

    // Check if there's a tab parameter to switch to a specific tab
    this.route.queryParams.subscribe((params) => {
      if (params['tab']) {
        this.selectedTab = params['tab'];
      }
    });

    // Store original account data for change detection
    this.storeOriginalAccountData();

    if (this.state) {
      this.filteredCities = this.malaysianCities[this.state] || [];
      console.log('State from storage:', this.state);
      console.log('Filtered cities:', this.filteredCities);
    }

    if (this.selectedTab === 'analysis') {
      this.updateAnalytics();
    }
  }

  onStateChange(): void {
    // Update cities based on selected state
    this.filteredCities = this.malaysianCities[this.state] || [];
    console.log('State changed to:', this.state);
    console.log('Updated filtered cities:', this.filteredCities);

    // Reset city if current city is not in the new state's city list
    if (this.city && !this.filteredCities.includes(this.city)) {
      this.city = '';
    }

    // Call existing method to track changes
    this.onAccountInfoChange();
  }

  // Add this method to the class
  storeOriginalAccountData(): void {
    this.originalAccountData = {
      username: this.username,
      avatar: this.avatar,
      gender: this.gender,
      contactNo: this.contactNo,
      address1: this.address1,
      address2: this.address2.trim(),
      city: this.city,
      state: this.state,
      country: this.country,
      zip: this.zip,
    };
    this.accountSaved = this.isFormValid();
    this.accountHasChanges = false;
  }

  checkAccountChanges(): void {
    if (!this.originalAccountData) {
      this.accountHasChanges = false;
      return;
    }

    this.accountHasChanges =
      this.username !== this.originalAccountData.username ||
      this.avatar !== this.originalAccountData.avatar ||
      this.gender !== this.originalAccountData.gender ||
      this.contactNo !== this.originalAccountData.contactNo ||
      this.address1 !== this.originalAccountData.address1 ||
      this.address2 !== this.originalAccountData.address2 ||
      this.city !== this.originalAccountData.city ||
      this.state !== this.originalAccountData.state ||
      this.country !== this.originalAccountData.country ||
      this.zip !== this.originalAccountData.zip;
  }

  trimAddress2(): void {
    this.address2 = this.address2.trim();
    this.onAccountInfoChange();
  }

  onAccountInfoChange(): void {
    this.checkAccountChanges();
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
    this.checkAccFormFields();

    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (this.contactNo.length !== 10) {
      this.invalidFields.add('contactNo');
      this.errorMessage = 'Contact Number must be 10 digits (0123456789)';
      return;
    }

    if (this.zip.length !== 5) {
      this.invalidFields.add('zip');
      this.errorMessage = 'ZIP/Postcode must be exactly 5 digits';
      return;
    }

    this.username = this.username.trim();
    this.contactNo = this.contactNo.trim();
    this.address1 = this.address1.trim();
    this.address2 = this.address2.trim();
    this.city = this.city.trim();
    this.state = this.state.trim();
    this.zip = this.zip.trim();

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

        // Update saved state
        this.accountSaved = true;
        this.accountHasChanges = false;
        this.storeOriginalAccountData();

        alert('Profile saved successfully!');
        window.location.reload();
      },
      (error) => {
        this.errorMessage = 'Failed to update profile. Please try again.';
        console.error('Profile update error:', error);
      }
    );
  }

  isFieldInvalid(fieldName: string): boolean {
    // Check if this is a pet field with an ID
    const isPetField =
      fieldName.startsWith('petName') ||
      fieldName.startsWith('petBreed') ||
      fieldName.startsWith('petGender');

    if (isPetField) {
      // Direct check for the exact field name with ID
      return this.invalidFields.has(fieldName);
    }

    return this.invalidFields.has(fieldName);
  }

  checkAccFormFields() {
    this.invalidFields.clear();

    if (!this.username) {
      this.invalidFields.add('username');
    }
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
  }

  validateContactNo(event: any): void {
    const input = event.target.value;

    // Allow only digits
    const digitsOnly = input.replace(/\D/g, '');

    // Limit to 10 digits
    this.contactNo = digitsOnly.substring(0, 10);

    // Update the input field value to reflect the valid value
    event.target.value = this.contactNo;

    // Trigger change detection for account info
    this.onAccountInfoChange();
  }

  validateZipInput(event: any): void {
    const input = event.target.value;

    // Allow only digits
    const digitsOnly = input.replace(/\D/g, '');

    // Limit to 5 digits
    this.zip = digitsOnly.substring(0, 5);

    // Update the input field value to reflect the valid value
    event.target.value = this.zip;

    this.onAccountInfoChange();
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
        this.onAccountInfoChange();
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
        _id: product._id,
        name: product.productTitle,
        price: product.productPrice,
        condition: product.condition,
        quantity: product.productQuantity,
        img: product.productImg[0],
        images: product.productImg.join(','),
        user: product.username,
        email: product.userEmail,
        avatar: product.userAvatar,
        description: product.productDesc,
        category: product.category,
        deliveryOptions: product.deliveryOpt?.join(','),
      },
    });
  }

  editProduct(product: any): void {
    const productId = product._id;

    if (!productId) {
      console.error('Cannot edit product: missing product ID');
      alert('Error: Cannot edit this product because the ID is missing');
      return;
    }

    // Navigate to edit product page with the product ID
    console.log('Editing product with ID:', productId);
    this.router.navigate(['/edit-product'], {
      queryParams: {
        id: productId,
      },
    });
  }

  getUserPets(): void {
    if (!this.email) {
      console.error('User email not found in storage');
      return;
    }

    this.profileService.getUserPets(this.email).subscribe(
      (pets) => {
        if (pets && pets.length > 0) {
          this.pets = pets.map((pet, index) => ({
            id: index + 1,
            _id: pet._id,
            name: pet.name,
            breed: pet.breed,
            gender: pet.gender,
            saved: true,
            hasChanges: false,
            createdAt: pet.createdAt,
            originalData: {
              name: pet.name,
              breed: pet.breed,
              gender: pet.gender,
            },
          }));
          this.nextPetId = this.pets.length + 1;
        }
      },
      (error) => {
        console.error('Error fetching pets', error);
      }
    );
  }

  checkPetChanges(pet: any): void {
    if (!pet.originalData) {
      pet.hasChanges = !pet.saved; // If no original data, consider changed if not saved
      return;
    }

    pet.hasChanges =
      pet.name !== pet.originalData.name ||
      pet.breed !== pet.originalData.breed ||
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
      breed: '',
      gender: '',
      saved: false,
      errorMessage: '',
      hasChanges: false,
    });
    this.nextPetId++;
  }

  removePet(id: number): void {
    const petToRemove = this.pets.find((p) => p.id === id);

    if (!petToRemove) {
      return;
    }

    // If pet has a database ID, delete it from database
    if (petToRemove._id) {
      this.profileService.removePet(this.email, petToRemove._id).subscribe(
        () => {
          this.performLocalPetRemoval(id);
          alert(`Pet ${id} has been removed`);
        },
        (error) => {
          console.error('Error removing pet from database', error);
          alert('Failed to remove pet from database');
        }
      );
    } else {
      // If not saved to database yet, just remove locally
      this.performLocalPetRemoval(id);
    }
  }

  clearPetValidationErrors(petId: number): void {
    // Remove all validation errors related to this pet ID
    this.invalidFields.delete('petName' + petId);
    this.invalidFields.delete('petBreed' + petId);
    this.invalidFields.delete('petGender' + petId);
  }

  performLocalPetRemoval(id: number): void {
    this.clearPetValidationErrors(id);

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
          breed: '',
          gender: '',
          saved: false,
          errorMessage: '',
          hasChanges: false,
        },
      ];
      this.nextPetId = 2;
    }
  }

  savePet(petId: number): void {
    this.invalidFields.clear();

    const pet = this.pets.find((p) => p.id === petId);
    if (!pet) {
      return;
    }

    pet.errorMessage = '';

    // Trim whitespace from string fields to check if they're truly empty
    const petName = pet.name.trim();
    const petBreed = pet.breed.trim();

    let isValid = true;
    if (!petName) {
      this.invalidFields.add('petName' + petId);
      isValid = false;
    }
    if (!petBreed) {
      this.invalidFields.add('petBreed' + petId);
      isValid = false;
    }
    if (!pet.gender) {
      this.invalidFields.add('petGender' + petId);
      isValid = false;
    }

    if (!isValid) {
      pet.errorMessage = 'Please fill in all required fields';
      return;
    }

    pet.name = petName;
    pet.breed = petBreed;

    const petData = {
      name: pet.name,
      breed: pet.breed,
      gender: pet.gender,
    };

    // If pet has a database ID, update it; otherwise create a new one
    if (pet._id) {
      this.profileService.updatePet(this.email, pet._id, petData).subscribe(
        (response) => {
          pet.saved = true;
          pet.hasChanges = false;
          // Store original data to detect future changes
          pet.originalData = { ...petData };
          this.errorPetMessage = '';
          alert(`Pet ${petId} information updated successfully!`);
        },
        (error) => {
          console.error('Error updating pet', error);
          pet.errorMessage = 'Failed to update pet information';
        }
      );
    } else {
      this.profileService.addPet(this.email, petData).subscribe(
        (response) => {
          pet._id = response.pet._id;
          pet.saved = true;
          pet.hasChanges = false;
          // Store original data to detect future changes
          pet.originalData = { ...petData };
          this.errorPetMessage = '';
          alert(`Pet ${petId} information saved successfully!`);
        },
        (error) => {
          console.error('Error saving pet', error);
          pet.errorMessage = 'Failed to save pet information';
        }
      );
    }
  }

  navigateToMarket() {
    this.router.navigate(['/market'], {
      queryParams: {
        openAddForm: 'true',
        fromProfile: 'true',
      },
    });
  }

  getPurchaseHistory(): void {
    if (!this.email) {
      console.error('User email not found in storage');
      return;
    }

    this.profileService.getPurchaseHistory(this.email).subscribe(
      (history) => {
        this.purchaseHistory = history;
        // Sort purchase history from newest to oldest
        this.purchaseHistory.sort((a, b) => {
          return (
            new Date(b.purchaseDate).getTime() -
            new Date(a.purchaseDate).getTime()
          );
        });
        this.filteredPurchaseHistory = [...this.purchaseHistory];
      },
      (error) => {
        console.error('Error fetching purchase history', error);
      }
    );
  }

  applyHistoryFilter(): void {
    // First create a copy of the original purchase history
    let filtered = [...this.purchaseHistory];

    // Apply filters based on selection
    switch (this.historyFilter) {
      case 'highToLow':
        filtered.sort((a, b) => b.totalAmount - a.totalAmount);
        break;
      case 'lowToHigh':
        filtered.sort((a, b) => a.totalAmount - b.totalAmount);
        break;
      case 'completed':
        filtered = filtered.filter((p) => p.status === 'Completed');
        break;
      case 'cancelled':
        filtered = filtered.filter((p) => p.status === 'Cancelled');
        break;
      case 'processing':
        filtered = filtered.filter((p) => p.status === 'Processing');
        break;
      default:
        // 'all' - just keep the default sorting (newest first)
        filtered.sort(
          (a, b) =>
            new Date(b.purchaseDate).getTime() -
            new Date(a.purchaseDate).getTime()
        );
    }

    this.filteredPurchaseHistory = filtered;
  }

  hasHistoryWithStatus(status: string): boolean {
    return this.purchaseHistory.some((p) => p.status === status);
  }

  formatDate(dateString: string | Date): string {
    const date = new Date(dateString);

    // Format: January 1, 2025 at 12:00 PM
    return (
      date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }) +
      ' at ' +
      date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  }

  getSalesHistory(): void {
    if (!this.email) {
      console.error('User email not found in storage');
      return;
    }
    this.isLoadingSales = true;
    this.profileService.getUserSales(this.email).subscribe(
      (sales) => {
        this.salesHistory = sales;
        // Sort sales history from newest to oldest
        this.salesHistory.sort((a, b) => {
          return (
            new Date(b.purchaseDate).getTime() -
            new Date(a.purchaseDate).getTime()
          );
        });
        this.filteredSalesHistory = [...this.salesHistory];
        this.isLoadingSales = false;
      },
      (error) => {
        console.error('Error fetching sales history:', error);
        this.isLoadingSales = false;
      }
    );
  }

  applySalesFilter(): void {
    switch (this.salesFilter) {
      case 'all':
        this.filteredSalesHistory = [...this.salesHistory];
        break;
      case 'highToLow':
        this.filteredSalesHistory = [...this.salesHistory].sort(
          (a, b) => b.price - a.price
        );
        break;
      case 'lowToHigh':
        this.filteredSalesHistory = [...this.salesHistory].sort(
          (a, b) => a.price - b.price
        );
        break;
      case 'completed':
        this.filteredSalesHistory = this.salesHistory.filter(
          (item) => item.status === 'Completed'
        );
        break;
      case 'processing':
        this.filteredSalesHistory = this.salesHistory.filter(
          (item) => item.status === 'Processing'
        );
        break;
      case 'cancelled':
        this.filteredSalesHistory = this.salesHistory.filter(
          (item) => item.status === 'Cancelled'
        );
        break;
    }
  }

  hasSalesWithStatus(status: string): boolean {
    return this.salesHistory.some((item) => item.status === status);
  }

  getUserServices(): void {
    if (!this.email) {
      console.error('User email not found in storage');
      return;
    }

    this.profileService.getUserServiceListings(this.email).subscribe({
      next: (services) => {
        this.userServices = services;
        console.log('Fetched user services:', services);
      },
      error: (error) => {
        console.error('Error fetching services', error);
      },
    });
  }

  navigateToJobs(): void {
    this.router.navigate(['/jobs']);
  }

  editService(service: any): void {
    // Navigate to jobs page with query parameters to trigger edit mode
    this.router.navigate(['/jobs'], {
      queryParams: {
        editService: 'true',
        serviceId: service._id,
      },
    });
  }

  // Add this to your ngOnInit or where appropriate
  updateAnalytics(): void {
    this.isLoadingAnalysis = true;

    if (this.salesHistory.length === 0 && !this.isLoadingSales) {
      this.getSalesHistory();

      setTimeout(() => {
        this.updateAnalytics();
      }, 300);
      return;
    }

    // Update the period label
    switch (this.analysisPeriod) {
      case 'month':
        this.analysisPeriodLabel = 'This Month';
        break;
      case 'quarter':
        this.analysisPeriodLabel = 'Last 3 Months';
        break;
      case 'year':
        this.analysisPeriodLabel = 'This Year';
        break;
      default:
        this.analysisPeriodLabel = 'All Time';
    }

    // Filter sales data based on selected period
    const filteredSales = this.filterSalesByPeriod(
      this.salesHistory,
      this.analysisPeriod
    );

    // Calculate metrics
    this.calculateSummaryMetrics(filteredSales);
    this.calculateStatusMetrics(filteredSales);
    this.calculateTopProducts(filteredSales);
    this.calculateInventoryValue();

    this.isLoadingAnalysis = false;
  }

  filterSalesByPeriod(sales: any[], period: string): any[] {
    if (!sales || sales.length === 0) return [];
    if (period === 'all') return sales;

    const now = new Date();
    const filtered = sales.filter((sale) => {
      const saleDate = new Date(sale.purchaseDate);

      switch (period) {
        case 'month':
          return (
            saleDate.getMonth() === now.getMonth() &&
            saleDate.getFullYear() === now.getFullYear()
          );

        case 'quarter':
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(now.getMonth() - 3);
          return saleDate >= threeMonthsAgo;

        case 'year':
          return saleDate.getFullYear() === now.getFullYear();

        default:
          return true;
      }
    });

    return filtered;
  }

  calculateSummaryMetrics(filteredSales: any[]): void {
    // Calculate total sales count
    this.totalSalesCount = filteredSales.length;

    // Calculate total revenue
    this.totalRevenue = filteredSales.reduce((total, sale) => {
      return total + sale.price * sale.quantity;
    }, 0);

    this.commissionPaid = this.totalRevenue * 0.1;
    this.netIncome = this.totalRevenue - this.commissionPaid;

    this.salesGrowth = 0;
    this.revenueGrowth = 0;

    this.averageOrderValue =
      this.totalSalesCount > 0 ? this.totalRevenue / this.totalSalesCount : 0;
  }

  calculateStatusMetrics(filteredSales: any[]): void {
    this.statusCounts = {
      Completed: 0,
      Processing: 0,
      Cancelled: 0,
    };

    filteredSales.forEach((sale) => {
      if (this.statusCounts[sale.status] !== undefined) {
        this.statusCounts[sale.status]++;
      }
    });
  }

  getStatusCount(status: string): number {
    return this.statusCounts[status] || 0;
  }

  getStatusPercentage(status: string): number {
    if (this.totalSalesCount === 0) return 0;
    return Math.round(
      ((this.statusCounts[status] || 0) / this.totalSalesCount) * 100
    );
  }

  calculateTopProducts(filteredSales: any[]): void {
    // Group sales by product and calculate units sold and revenue
    const productMap = new Map();

    filteredSales.forEach((sale) => {
      const key = sale.productTitle;
      if (!productMap.has(key)) {
        productMap.set(key, {
          title: sale.productTitle,
          unitsSold: sale.quantity,
          revenue: sale.price * sale.quantity,
        });
      } else {
        const product = productMap.get(key);
        product.unitsSold += sale.quantity;
        product.revenue += sale.price * sale.quantity;
        productMap.set(key, product);
      }
    });

    // Convert map to array and sort by revenue
    this.topProducts = Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5); // Get top 5 products
  }

  calculateInventoryValue(): void {
    this.inventoryValue = this.userProducts.reduce((total, product) => {
      return total + product.productPrice * product.productQuantity;
    }, 0);

    this.totalInventoryItems = this.userProducts.reduce((total, product) => {
      return total + product.productQuantity;
    }, 0);
  }

  onTabChange(tab: string): void {
    this.selectedTab = tab;

    if (tab === 'analysis') {
      this.updateAnalytics();
    }
  }
}
