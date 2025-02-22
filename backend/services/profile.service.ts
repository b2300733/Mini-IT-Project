import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private baseUrl = 'http://localhost:3000/api/profile';

  constructor(private http: HttpClient) {}

  sendVerificationCode(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/request-reset`, { email });
  }

  resetPassword(
    email: string,
    code: string,
    newPassword: string
  ): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, {
      email,
      code,
      newPassword,
    });
  }
}
