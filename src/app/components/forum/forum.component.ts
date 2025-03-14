import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ForumService } from '../../../../backend/services/forum.service';

interface Comment {
  id: number;
  userEmail: string;
  content: string;
  timestamp: string;
  replies: Comment[];
  isReplying: boolean;
}

interface ForumPost {
  id?: string;
  title: string;
  content: string;
  userEmail: string;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  timestamp: string;
  category: string;
  comments: Comment[];
}

@Component({
  selector: 'app-forum',
  standalone: false,
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css'],
})
export class ForumComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  mainCategories = [
    { value: 'dog', label: 'Dog' },
    { value: 'cat', label: 'Cat' },
    { value: 'other', label: 'Other' },
  ];
  filterCategories: string[] = ['All', 'Dog', 'Cat', 'Other'];
  postCategories: string[] = ['Dog', 'Cat', 'Other'];
  selectedCategory: string = '';
  activeCategory: string | null = null;
  showNewPostForm = false;
  postForm: FormGroup;
  commentForm: FormGroup;
  replyForm: FormGroup;
  private originalPosts: ForumPost[] = [];
  posts: ForumPost[] = [];
  selectedPost: ForumPost | null = null;
  isDetailView = false;
  searchQuery: string = '';
  currentStep = 1;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private forumService: ForumService
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
      category: ['', Validators.required],
    });

    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(1)]],
    });

    this.replyForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  ngOnInit() {
    this.fetchForumPosts();
  }

  fetchForumPosts() {
    this.forumService.getAllPosts().subscribe({
      next: (response) => {
        this.posts = response;
        this.originalPosts = [...response];
      },
      error: (error) => {
        console.error('Error fetching forum posts:', error);
      },
    });
  }

  toggleNewPost() {
    this.showNewPostForm = !this.showNewPostForm;
    if (this.showNewPostForm) {
      this.currentStep = 1;
      this.resetListingForm();
    }
  }

  resetListingForm() {
    this.postForm.reset({
      title: '',
      content: '',
      category: '', // Reset to empty string
    });
    this.selectedCategory = '';
    this.currentStep = 1;
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.target.value;
    // If you need to filter posts by category
    if (this.selectedCategory) {
      this.filterByCategory(this.selectedCategory);
    }
  }

  isLoggedIn(): boolean {
    return !!(localStorage.getItem('email') || sessionStorage.getItem('email'));
  }

  submitPost() {
    if (!this.isLoggedIn()) {
      alert('Please login first to create a post');
      this.router.navigate(['/login']);
      return;
    }

    if (this.postForm.valid) {
      const userEmail =
        localStorage.getItem('email') || sessionStorage.getItem('email');

      if (!userEmail) {
        alert('Please login first to create a post');
        this.router.navigate(['/login']);
        return;
      }

      const postData = {
        title: this.postForm.value.title.trim(),
        content: this.postForm.value.content.trim(),
        category: this.postForm.value.category,
        userEmail: userEmail,
        upvotes: 0,
        downvotes: 0,
        commentCount: 0,
        comments: [],
        timestamp: new Date().toISOString(),
      };

      console.log('Sending post data:', postData); // Debug log

      this.forumService.createPost(postData).subscribe({
        next: (response) => {
          console.log('Post created successfully:', response);
          this.fetchForumPosts();
          this.postForm.reset();
          this.showNewPostForm = false;
          alert('Your post has been created successfully!');
        },
        error: (error) => {
          console.error('Error details:', error); // Detailed error log
          const errorMessage =
            error.error?.message ||
            'There was an error creating your post. Please try again.';
          alert(errorMessage);
        },
      });
    } else {
      // Form validation failed
      Object.keys(this.postForm.controls).forEach((key) => {
        const control = this.postForm.get(key);
        if (control?.invalid) {
          console.log(`${key} is invalid:`, control.errors); // Debug validation
        }
      });
    }
  }

  filterByCategory(category: string) {
    this.activeCategory = category;

    if (category === 'All') {
      this.posts = [...this.originalPosts];
    } else {
      this.posts = this.originalPosts.filter(
        (post) => post.category === category
      );
    }
  }

  searchPosts(event: any) {
    const searchTerm = event.target.value.toLowerCase();

    if (!searchTerm) {
      this.posts = [...this.originalPosts];
      return;
    }

    this.posts = this.originalPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.userEmail.toLowerCase().includes(searchTerm)
    );
  }

  viewPost(post: ForumPost) {
    this.selectedPost = post;
    this.isDetailView = true;
  }

  backToListing() {
    this.selectedPost = null;
    this.isDetailView = false;
  }

  submitComment() {
    if (this.commentForm.valid && this.selectedPost) {
      const newComment: Comment = {
        id: this.getNextCommentId(),
        userEmail: '', // Replace with actual logged-in user
        content: this.commentForm.value.content,
        timestamp: 'Just now',
        replies: [],
        isReplying: false,
      };

      this.selectedPost.comments.push(newComment);
      this.selectedPost.commentCount += 1;
      this.commentForm.reset();
    }
  }

  toggleReplyForm(comment: Comment) {
    comment.isReplying = !comment.isReplying;
    if (!comment.isReplying) {
      this.replyForm.reset();
    }
  }

  submitReply(parentComment: Comment) {
    if (this.replyForm.valid) {
      const newReply: Comment = {
        id: this.getNextCommentId(),
        userEmail: '', // Replace with actual logged-in user
        content: this.replyForm.value.content,
        timestamp: 'Just now',
        replies: [],
        isReplying: false,
      };

      parentComment.replies.push(newReply);
      if (this.selectedPost) {
        this.selectedPost.commentCount += 1;
      }

      parentComment.isReplying = false;
      this.replyForm.reset();
    }
  }

  private getNextCommentId(): number {
    let maxId = 0;

    this.posts.forEach((post) => {
      post.comments.forEach((comment) => {
        maxId = Math.max(maxId, comment.id);
        comment.replies.forEach((reply) => {
          maxId = Math.max(maxId, reply.id);
        });
      });
    });

    return maxId + 1;
  }

  upvotePost(post: ForumPost, event: Event) {
    event.stopPropagation(); // Prevent viewPost from triggering
    post.upvotes += 1;
  }

  downvotePost(post: ForumPost, event: Event) {
    event.stopPropagation(); // Prevent viewPost from triggering
    post.downvotes += 1;
  }
}
