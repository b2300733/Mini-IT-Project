import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  private baseUrl = 'http://localhost:3000/api/shop';

  constructor(private http: HttpClient) {}

  uploadProduct(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, formData);
  }

  getProducts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`);
  }

  getUserByEmail(email: string): Observable<any> {
    return this.http.get(`http://localhost:3000/api/users?email=${email}`);
  }
}
