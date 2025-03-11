import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private baseUrl = 'http://localhost:3000/api/login';

  constructor(private http: HttpClient, private cartService: CartService) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, { email, password }).pipe(
      tap((response) => {
        localStorage.setItem('email', response.user.email);
        this.cartService.fetchCart(response.user.email);
      })
    );
  }
}
