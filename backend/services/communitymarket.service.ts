import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunitymarketService {
  private baseUrl = 'http://localhost:3000/api/market';

  constructor(private http: HttpClient) {}

  // Upload a product with multiple images
  uploadProduct(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, formData);
  }

  // Fetch all products
  getProducts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`);
  }
}
