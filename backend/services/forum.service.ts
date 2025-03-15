import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ForumPost {
  _id?: string;
  title: string;
  content: string;
  category: string;
  userEmail: string;
  upvotes: number;
  downvotes: number;
  upvotedBy: string[];
  downvotedBy: string[];
  commentCount: number;
  comments: Array<Comment>;
  timestamp: string;
}

export interface Comment {
  id: number;
  userEmail: string;
  content: string;
  timestamp: string;
  replies: Comment[];
  isReplying: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ForumService {
  private baseUrl = 'http://localhost:3000/api/forum';

  constructor(private http: HttpClient) {}

  createPost(postData: Omit<ForumPost, 'id'>): Observable<ForumPost> {
    const cleanedData = {
      title: postData.title,
      content: postData.content,
      category: postData.category,
      userEmail: postData.userEmail,
      upvotes: 0,
      downvotes: 0,
      upvotedBy: [],
      downvotedBy: [],
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

  upvotePost(postId: string, userEmail: string): Observable<ForumPost> {
    // Log for debugging
    console.log('Upvoting post:', { postId, userEmail });

    return this.http.post<ForumPost>(`${this.baseUrl}/posts/${postId}/vote`, {
      userEmail,
      voteType: 'upvote',
    });
  }

  downvotePost(postId: string, userEmail: string): Observable<ForumPost> {
    // Log for debugging
    console.log('Downvoting post:', { postId, userEmail });

    return this.http.post<ForumPost>(`${this.baseUrl}/posts/${postId}/vote`, {
      userEmail,
      voteType: 'downvote',
    });
  }
}
