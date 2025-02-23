import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth-callback',
  standalone: false,
  template: '',
})
export class AuthCallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      console.log('Received auth params:', params);

      const token = params['token'];
      const username = params['username'];
      const email = params['email'];
      const avatar = params['avatar'];
      const contactNo = params['contactNo'] || '';
      const address = params['address'] || '';
      const gender = params['gender'] || '';

      if (token && username && avatar) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
        localStorage.setItem('avatar', avatar);
        localStorage.setItem('contactNo', contactNo);
        localStorage.setItem('address', address);
        localStorage.setItem('gender', gender);
        this.router.navigate(['/profile']).then(() => {
          window.location.reload();
        });
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
