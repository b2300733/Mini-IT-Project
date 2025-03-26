import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface JobsListing {
  _id?: string;
  category: string;
  title: string;
  address: string;
  phoneNumber: string;
  ownerName: string;
  petType: string;
  note?: string;
  hourRate: number;
  userEmail?: string;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class JobsService {
  private baseUrl = 'http://localhost:3000/api/jobs';

  constructor(private http: HttpClient) {}

  // Get all jobs
  getAllJobs(): Observable<JobsListing[]> {
    return this.http.get<JobsListing[]>(this.baseUrl);
  }

  // Get jobs by category
  getJobsByCategory(category: string): Observable<JobsListing[]> {
    return this.http.get<JobsListing[]>(`${this.baseUrl}/category/${category}`);
  }

  // Get jobs by location
  getJobsByLocation(location: string): Observable<JobsListing[]> {
    return this.http.get<JobsListing[]>(
      `${this.baseUrl}/location?location=${location}`
    );
  }

  // Create a new job
  createJob(jobData: JobsListing): Observable<JobsListing> {
    return this.http.post<JobsListing>(this.baseUrl, jobData);
  }

  // Delete a job
  deleteJob(id: string): Observable<any> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }

  updateJob(id: string, jobData: JobsListing): Observable<JobsListing> {
    return this.http.put<JobsListing>(`${this.baseUrl}/${id}`, jobData);
  }
}
