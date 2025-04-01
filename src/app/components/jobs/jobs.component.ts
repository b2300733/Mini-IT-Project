import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  JobsService,
  JobsListing,
} from '../../../../backend/services/jobs.service';
import { UserService } from '../../../../backend/services/user.service';

interface ServiceListing {
  category: string;
  title: string;
  address: string;
  phoneNumber: string;
  ownerName: string;
  petType: string;
  note: string;
  hourRate: number;
}

@Component({
  selector: 'app-jobs',
  standalone: false,
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css'],
})
export class JobsComponent implements OnInit {
  serviceCategories = ['Day Care', 'Pet Sitting', 'Pet Walking', 'Grooming'];
  petTypes = ['Dog', 'Cat', 'Other'];

  selectedCategory: string = '';
  searchLocation: string = '';
  showListingForm: boolean = false;
  isLoading: boolean = true;
  error: string | null = null;

  private originalListings: JobsListing[] = [];
  listings: JobsListing[] = [];
  listingForm: FormGroup;

  userEmail: string = '';
  userName: string = '';

  // Location data
  userAddress: string = '';
  userState: string = '';
  userCity: string = '';
  userZip: string = '';
  userCountry: string = '';

  displayLimit: number = 6;
  hasMoreListings: boolean = false;

  constructor(
    private fb: FormBuilder,
    private jobsService: JobsService,
    private userService: UserService
  ) {
    // Get user data from storage
    this.userEmail =
      localStorage.getItem('email') || sessionStorage.getItem('email') || '';

    // Get username from localStorage
    this.userName =
      localStorage.getItem('username') ||
      sessionStorage.getItem('username') ||
      '';

    console.log('Available localStorage keys:', Object.keys(localStorage));

    this.userState =
      localStorage.getItem('state') ||
      localStorage.getItem('State') ||
      localStorage.getItem('user_state') ||
      '';

    this.userCity =
      localStorage.getItem('city') ||
      localStorage.getItem('City') ||
      localStorage.getItem('user_city') ||
      '';

    this.userZip =
      localStorage.getItem('zip') ||
      localStorage.getItem('Zip') ||
      localStorage.getItem('zipCode') ||
      localStorage.getItem('postalCode') ||
      '';

    this.userCountry =
      localStorage.getItem('country') ||
      localStorage.getItem('Country') ||
      localStorage.getItem('user_country') ||
      '';

    // Log what we found
    console.log('Location data from storage:', {
      state: this.userState,
      city: this.userCity,
      zip: this.userZip,
      country: this.userCountry,
    });

    // Get phone number from storage using contactNo (correct field from user model)
    const userPhone =
      localStorage.getItem('contactNo') ||
      localStorage.getItem('phone') ||
      localStorage.getItem('phoneNumber') ||
      sessionStorage.getItem('contactNo') ||
      '';

    // Create full address string
    const locationParts = [
      this.userCity,
      this.userState,
      this.userZip,
      this.userCountry,
    ]
      .filter((part) => part) // Remove empty values
      .join(', ');

    console.log('Combined location string:', locationParts);

    this.listingForm = this.fb.group({
      category: ['', Validators.required],
      title: ['', Validators.required],
      address: [
        { value: locationParts, disabled: !!locationParts },
        Validators.required,
      ],
      phoneNumber: [
        { value: userPhone, disabled: !!userPhone },

        [Validators.required, Validators.pattern('^[0-9]{8,}$')],
      ],
      ownerName: [
        { value: this.userName || '', disabled: !!this.userName },
        Validators.required,
      ],
      petType: ['', Validators.required],
      note: [''],
      hourRate: ['', [Validators.required, Validators.min(0)]],
    });

    // If user is logged in but we don't have their data, fetch it
    if (this.userEmail && (!this.userName || !locationParts || !userPhone)) {
      console.log('Fetching user data because some information is missing');
      this.loadUserData();
    }
  }

  loadUserData(): void {
    console.log('Loading user data for email:', this.userEmail);
    this.userService.getUserByEmail(this.userEmail).subscribe({
      next: (userData) => {
        console.log('User data received:', userData);

        // Update user data
        this.userName = userData.username || userData.name || '';
        this.userState = userData.state || '';
        this.userCity = userData.city || '';
        this.userZip = userData.zip || userData.zipCode || '';
        this.userCountry = userData.country || '';

        // Store in localStorage for future use - store with multiple key variations to ensure retrieval
        if (userData.username || userData.name) {
          localStorage.setItem('username', userData.username || userData.name);
        }

        if (userData.state) {
          localStorage.setItem('state', userData.state);
          localStorage.setItem('user_state', userData.state);
        }

        if (userData.city) {
          localStorage.setItem('city', userData.city);
          localStorage.setItem('user_city', userData.city);
        }

        if (userData.zip || userData.zipCode) {
          localStorage.setItem('zip', userData.zip || userData.zipCode || '');
          localStorage.setItem(
            'zipCode',
            userData.zip || userData.zipCode || ''
          );
        }

        if (userData.country) {
          localStorage.setItem('country', userData.country);
          localStorage.setItem('user_country', userData.country);
        }

        if (userData.contactNo) {
          localStorage.setItem('contactNo', userData.contactNo.toString());
          localStorage.setItem('phone', userData.contactNo.toString());
        }

        // Update form values
        const locationParts = [
          userData.city,
          userData.state,
          userData.zip || userData.zipCode,
          userData.country,
        ]
          .filter((part) => part)
          .join(', ');

        console.log('Location parts for form:', locationParts);

        this.listingForm.patchValue({
          ownerName: userData.username || userData.name || '',
          address: locationParts,
          phoneNumber: userData.contactNo ? userData.contactNo.toString() : '',
        });
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
      },
    });
  }

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.isLoading = true;
    this.jobsService.getAllJobs().subscribe({
      next: (jobs) => {
        this.originalListings = [...jobs];
        this.displayLimit = 6;
        this.filterListings();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching jobs:', err);
        this.error = 'Failed to load jobs. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  onCategoryChange(event: any): void {
    this.selectedCategory = event.target.value;
    this.displayLimit = 6;
    this.filterListings();
  }

  onLocationSearch(event: any): void {
    this.searchLocation = event.target.value.toLowerCase();
    this.displayLimit = 6;
    this.filterListings();
  }

  private filterListings(): void {
    let filteredList: JobsListing[] = [];

    if (!this.selectedCategory && !this.searchLocation) {
      filteredList = [...this.originalListings];
    } else if (this.selectedCategory && !this.searchLocation) {
      filteredList = this.originalListings.filter(
        (listing) => listing.category === this.selectedCategory
      );
    } else {
      // Client-side filtering for more complex cases
      filteredList = this.originalListings.filter((listing) => {
        const matchesCategory =
          !this.selectedCategory || listing.category === this.selectedCategory;
        const matchesLocation =
          !this.searchLocation ||
          listing.address.toLowerCase().includes(this.searchLocation);
        return matchesCategory && matchesLocation;
      });
    }

    // Check if there are more listings beyond the display limit
    this.hasMoreListings = filteredList.length > this.displayLimit;

    // Apply the display limit
    this.listings = filteredList.slice(0, this.displayLimit);
  }

  loadMoreListings(): void {
    // Increase the display limit
    this.displayLimit += 6;
    // Re-apply the filters with the new limit
    this.filterListings();
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.searchLocation = '';
    this.loadJobs();
  }

  editListing(listing: JobsListing): void {
    // Set the form with the listing data
    this.listingForm.patchValue({
      category: listing.category,
      title: listing.title,
      address: listing.address,
      phoneNumber: listing.phoneNumber,
      ownerName: listing.ownerName,
      petType: listing.petType,
      note:
        listing.note && listing.note !== 'Requester did not add any note'
          ? listing.note
          : '',
      hourRate: listing.hourRate,
    });

    // Store the listing ID for update operation
    this.editingListingId = listing._id ?? null;

    // Show the form
    this.showListingForm = true;

    // Update submit button text
    this.isEditing = true;
  }

  // Add these properties to the component class
  editingListingId: string | null = null;
  isEditing: boolean = false;

  toggleListingForm(): void {
    this.showListingForm = !this.showListingForm;

    if (this.showListingForm) {
      // If opening the form for a new listing
      if (!this.isEditing) {
        this.listingForm.reset();

        // Re-populate form fields with user data
        const locationParts = [
          this.userCity,
          this.userState,
          this.userZip,
          this.userCountry,
        ]
          .filter((part) => part)
          .join(', ');

        const userPhone =
          localStorage.getItem('contactNo') ||
          sessionStorage.getItem('contactNo') ||
          '';

        this.listingForm.patchValue({
          ownerName: this.userName || '',
          address: locationParts,
          phoneNumber: userPhone,
        });
      }
    } else {
      // If closing the form, reset editing state
      this.isEditing = false;
      this.editingListingId = null;
    }
  }

  submitListing(): void {
    if (this.listingForm.valid) {
      // Get both enabled and disabled form values
      const formValue = {
        ...this.listingForm.getRawValue(),
        userEmail: this.userEmail,
      };

      if (!formValue.note || formValue.note.trim() === '') {
        formValue.note = '*Requester did not add any note';
      }

      const listingData: JobsListing = formValue;

      if (this.isEditing && this.editingListingId) {
        // Update existing listing
        this.jobsService
          .updateJob(this.editingListingId, listingData)
          .subscribe({
            next: (updatedJob) => {
              // Find and replace the updated job in the listings arrays
              const index = this.listings.findIndex(
                (job) => job._id === this.editingListingId
              );
              if (index !== -1) {
                this.listings[index] = updatedJob;
              }

              const origIndex = this.originalListings.findIndex(
                (job) => job._id === this.editingListingId
              );
              if (origIndex !== -1) {
                this.originalListings[origIndex] = updatedJob;
              }

              // Show success message
              alert('Service listing updated successfully!');

              // Reset form and close
              this.listingForm.reset();
              this.showListingForm = false;
              this.isEditing = false;
              this.editingListingId = null;
              this.filterListings();
            },
            error: (err) => {
              console.error('Error updating job:', err);
              alert('Failed to update job listing. Please try again.');
            },
          });
      } else {
        // Create new listing
        this.jobsService.createJob(listingData).subscribe({
          next: (createdJob) => {
            // Add to beginning of listings arrays
            this.listings.unshift(createdJob);
            this.originalListings.unshift(createdJob);

            // Show success message
            alert('Service listing created successfully!');

            // Reset form and close
            this.listingForm.reset();
            this.showListingForm = false;
            this.filterListings();
          },
          error: (err) => {
            console.error('Error creating job:', err);
            alert('Failed to create job listing. Please try again.');
          },
        });
      }
    } else {
      // Show validation errors
      Object.keys(this.listingForm.controls).forEach((key) => {
        const control = this.listingForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  // Add this helper method for form validation
  showError(fieldName: string): boolean {
    const field = this.listingForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  deleteListing(): void {
    if (!this.editingListingId) {
      return;
    }

    // Confirm deletion
    if (
      confirm(
        'Are you sure you want to delete this listing? This action cannot be undone.'
      )
    ) {
      this.jobsService.deleteJob(this.editingListingId).subscribe({
        next: () => {
          // Remove from listings arrays
          this.listings = this.listings.filter(
            (job) => job._id !== this.editingListingId
          );
          this.originalListings = this.originalListings.filter(
            (job) => job._id !== this.editingListingId
          );

          // Show success message
          alert('Service listing deleted successfully!');

          // Reset form and close
          this.listingForm.reset();
          this.showListingForm = false;
          this.isEditing = false;
          this.editingListingId = null;
        },
        error: (err) => {
          console.error('Error deleting job:', err);
          alert('Failed to delete job listing. Please try again.');
        },
      });
    }
  }
}
