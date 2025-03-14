import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ForumPost {
  id?: string;
  title: string;
  content: string;
  userEmail: string;
  category: string;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  comments: Comment[];
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class ForumService {
  private baseUrl = 'http://localhost:3000/api/forum';

  constructor(private http: HttpClient) {}

  createPost(postData: Omit<ForumPost, 'id'>): Observable<ForumPost> {
    // Clean up the data before sending
    const cleanedData = {
      title: postData.title,
      content: postData.content,
      category: postData.category,
      userEmail: postData.userEmail,
      upvotes: 0,
      downvotes: 0,
      commentCount: 0,
      comments: [],
      timestamp: new Date().toISOString(),
    };

    return this.http.post<ForumPost>(`${this.baseUrl}/posts`, cleanedData);
  }

  getAllPosts(): Observable<ForumPost[]> {
    return this.http.get<ForumPost[]>(`${this.baseUrl}/posts`);
  }

  addComment(
    postId: string,
    comment: { content: string; userEmail: string }
  ): Observable<any> {
    return this.http.post(`${this.baseUrl}/posts/${postId}/comments`, comment);
  }

  addReply(
    postId: string,
    commentId: string,
    reply: { content: string; userEmail: string }
  ): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/posts/${postId}/comments/${commentId}/replies`,
      reply
    );
  }
}
