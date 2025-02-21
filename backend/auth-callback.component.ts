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
      const token = params['token'];
      const username = params['username'];
      const avatar = params['avatar'];

      if (token && username && avatar) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('username', username);
        localStorage.setItem('avatar', avatar);
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
