import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../backend/services/cart.service';

@Component({
  selector: 'app-auth-callback',
  standalone: false,
  template: '',
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      console.log('Received auth params:', params);

      const token = params['token'];
      const username = params['username'];
      const email = params['email'];
      const avatar = params['avatar'];
      const contactNo = params['contactNo'] || '';
      const gender = params['gender'] || '';
      const address1 = params['address1'] || '';
      const address2 = params['address2'] || '';
      const city = params['city'] || '';
      const state = params['address1'] || '';
      const country = params['country'] || '';
      const zip = params['zip'] || '';

      if (token && username) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
        localStorage.setItem('avatar', avatar);
        localStorage.setItem('contactNo', contactNo);
        localStorage.setItem('gender', gender);
        localStorage.setItem('address1', address1);
        localStorage.setItem('address2', address2);
        localStorage.setItem('city', city);
        localStorage.setItem('state', state);
        localStorage.setItem('country', country);
        localStorage.setItem('zip', zip);
        this.cartService.setUserEmail(email);
        this.router.navigate(['/profile']).then(() => {
          window.location.reload();
        });
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
