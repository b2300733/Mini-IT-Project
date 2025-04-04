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

  onStateChange(): void {
    // Update cities based on selected state
    this.filteredCities = this.malaysianCities[this.state] || [];

    // Reset city if current city is not in the new state's city list
    if (this.city && !this.filteredCities.includes(this.city)) {
      this.city = '';
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

    if (this.contactNo.length !== 10) {
      this.errorMessage = 'Contact Number must be 10 digits (0123456789)';
      this.invalidFields.add('contactNo');
      return false;
    }

    if (this.zip.length !== 5) {
      this.errorMessage = 'ZIP/Postcode must be exactly 5 digits';
      this.invalidFields.add('zip');
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

  validateNumberInput(event: any): void {
    const input = event.target.value;

    // Allow only digits
    const digitsOnly = input.replace(/\D/g, '');

    // Limit to 10 digits
    this.contactNo = digitsOnly.substring(0, 10);

    // Update the input field value to reflect the valid value
    event.target.value = this.contactNo;
  }

  validateZipInput(event: any): void {
    const input = event.target.value;

    // Allow only digits
    const digitsOnly = input.replace(/\D/g, '');

    // Limit to 5 digits
    this.zip = digitsOnly.substring(0, 5);

    // Update the input field value to reflect the valid value
    event.target.value = this.zip;
  }

  openTermsAndConditions(event: Event) {
    event.preventDefault();
    window.open('/tac', '_blank');
  }
}
