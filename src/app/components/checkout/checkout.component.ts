import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  CartService,
  CartItem,
} from '../../../../backend/services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  cartItems: CartItem[] = [];
  isProcessing: boolean = false;
  invalidFields: Set<string> = new Set();

  email = '';
  contactNo = '';
  address = '';
  address1 = '';
  address2 = '';
  city = '';
  state = '';
  country = '';
  zip = '';

  completeAddress = '';

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

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    // Get cart items
    this.cartService.getCartItems().subscribe((items) => {
      this.cartItems = items;
    });

    // Get user details from localStorage or sessionStorage
    this.email =
      localStorage.getItem('email') || sessionStorage.getItem('email') || '';
    this.contactNo =
      localStorage.getItem('contactNo') ||
      sessionStorage.getItem('contactNo') ||
      '';
    this.address1 =
      localStorage.getItem('address1') ||
      sessionStorage.getItem('address1') ||
      '';
    this.address2 =
      localStorage.getItem('address2') ||
      sessionStorage.getItem('address2') ||
      '';
    this.city =
      localStorage.getItem('city') || sessionStorage.getItem('city') || '';
    this.state =
      localStorage.getItem('state') || sessionStorage.getItem('state') || '';
    this.country =
      localStorage.getItem('country') ||
      sessionStorage.getItem('country') ||
      '';
    this.zip =
      localStorage.getItem('zip') || sessionStorage.getItem('zip') || '';

    if (this.state) {
      this.filteredCities = this.malaysianCities[this.state] || [];
      console.log('State from storage:', this.state);
      console.log('Filtered cities:', this.filteredCities);
    }

    this.combineAddressForDisplay();
    this.generateCompleteAddress();
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
  }

  combineAddressForDisplay(): void {
    // Combine address1 and address2 into a single field for display
    if (this.address1 && this.address2) {
      this.address = `${this.address1}, ${this.address2}`;
    } else {
      this.address = this.address1 || this.address2 || '';
    }
  }

  generateCompleteAddress(): void {
    // Filter out any empty parts and join with commas
    const addressParts = [
      this.address,
      this.city,
      this.state,
      this.zip,
      this.country,
    ].filter((part) => part.trim() !== '');

    this.completeAddress = addressParts.join(', ');
  }

  validateUserDetails(): boolean {
    this.invalidFields.clear();

    let isValid = true;

    if (!this.email) {
      this.invalidFields.add('email');
      isValid = false;
    }

    if (!this.contactNo) {
      this.invalidFields.add('contactNo');
      isValid = false;
    } else if (this.contactNo.length !== 10) {
      this.invalidFields.add('contactNo');
      isValid = false;
    }

    if (!this.address) {
      this.invalidFields.add('address');
      isValid = false;
    }

    if (!this.city) {
      this.invalidFields.add('city');
      isValid = false;
    }

    if (!this.state) {
      this.invalidFields.add('state');
      isValid = false;
    }

    if (!this.zip) {
      this.invalidFields.add('zip');
      isValid = false;
    } else if (this.zip.length !== 5) {
      this.invalidFields.add('zip');
      isValid = false;
    }

    if (!this.country) {
      this.invalidFields.add('country');
      isValid = false;
    }

    if (!isValid) {
      // Instead of an alert, we now use inline validation messages
      return false;
    }
    return true;
  }

  checkout(): void {
    if (this.isProcessing) return;
    this.generateCompleteAddress();

    if (!this.validateUserDetails()) return;

    this.isProcessing = true;

    const userDetails = {
      email: this.email,
      contactNo: this.contactNo,
      address: this.completeAddress,
    };

    this.cartService.checkout(userDetails).subscribe(
      (response) => {
        this.isProcessing = false;

        // Display results to the user
        if (response.failedItems && response.failedItems.length > 0) {
          const failedItemNames = response.failedItems
            .map((item) => `${item.productTitle} (${item.reason})`)
            .join('\n');

          alert(
            `Checkout completed with some issues:\n${failedItemNames}\n\nOther items were purchased successfully.`
          );
        } else {
          alert('Checkout completed successfully!');
        }

        this.router.navigate(['/cart']);
      },
      (error) => {
        this.isProcessing = false;
        console.error('Error during checkout:', error);
        alert('There was an error processing your checkout. Please try again.');
      }
    );
  }

  isFieldInvalid(fieldName: string): boolean {
    return this.invalidFields.has(fieldName);
  }

  validateContactNo(event: any): void {
    const input = event.target.value;

    // Allow only digits
    const digitsOnly = input.replace(/\D/g, '');

    // Limit to 10 digits
    this.contactNo = digitsOnly.substring(0, 10);

    // Update the input field value to reflect the valid value
    event.target.value = this.contactNo;

    // Check if the contactNo field is being tracked for validation
    if (this.invalidFields.has('contactNo')) {
      // If it's already marked as invalid, check on every input if it's now valid
      if (this.contactNo.length === 10) {
        this.invalidFields.delete('contactNo');
      }
    }
  }

  validateZipInput(event: any): void {
    const input = event.target.value;

    // Allow only digits
    const digitsOnly = input.replace(/\D/g, '');

    // Limit to 5 digits
    this.zip = digitsOnly.substring(0, 5);

    // Update the input field value to reflect the valid value
    event.target.value = this.zip;

    // Check if the zip field is being tracked for validation
    if (this.invalidFields.has('zip')) {
      // If it's already marked as invalid, check on every input if it's now valid
      if (this.zip.length === 5) {
        this.invalidFields.delete('zip');
      }
    }
  }
}
