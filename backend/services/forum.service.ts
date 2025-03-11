import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:3000/posts';

  constructor(private http: HttpClient) {}

  getPosts() {
    return this.http.get(this.apiUrl);
  }

  createPost(post: any) {
    return this.http.post(this.apiUrl, post);
  }

  upvotePost(postId: string) {
    return this.http.put(`${this.apiUrl}/${postId}/upvote`, {});
  }
}
