import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ForumService } from '../../../../backend/services/forum.service';

interface Comment {
  id: number;
  userEmail: string;
  userName: string; // Add this line
  content: string;
  timestamp: string;
  replies: Comment[];
  isReplying: boolean;
  replyContent?: string;
}

interface ForumPost {
  _id?: string;
  title: string;
  content: string;
  userEmail: string;
  userName: string;
  category: string;
  upvotes: number;
  downvotes: number;
  upvotedBy: string[];
  downvotedBy: string[];
  commentCount: number;
  comments: Comment[];
  timestamp: string;
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
  userEmail: string = '';
  userName: string = '';

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

    this.userEmail =
      localStorage.getItem('email') || sessionStorage.getItem('email') || '';

    this.userName =
    localStorage.getItem('username') || sessionStorage.getItem('username') || '';
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
      const username =
        localStorage.getItem('username') || sessionStorage.getItem('username');

      if (!userEmail || !username) {
        alert('Please login first to create a post');
        this.router.navigate(['/login']);
        return;
      }

      const postData: Omit<ForumPost, 'id'> = {
        title: this.postForm.value.title.trim(),
        content: this.postForm.value.content.trim(),
        category: this.postForm.value.category,
        userEmail: userEmail,
        userName: username, // Add username
        upvotes: 0,
        downvotes: 0,
        commentCount: 0,
        comments: [],
        upvotedBy: [],
        downvotedBy: [],
        timestamp: new Date().toISOString(),
      };

      console.log('Sending post data:', postData);

      this.forumService.createPost(postData).subscribe({
        next: (response) => {
          console.log('Post created successfully:', response);
          this.fetchForumPosts();
          this.postForm.reset();
          this.showNewPostForm = false;
          alert('Your post has been created successfully!');
        },
        error: (error) => {
          console.error('Error details:', error);
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
          console.log(`${key} is invalid:`, control.errors);
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
      const userName =
        localStorage.getItem('username') || sessionStorage.getItem('username');

      const comment = {
        content: this.commentForm.value.content.trim(),
        userEmail: this.userEmail,
        userName: this.userName,
      };

      console.log('Submitting comment:', comment);

      this.forumService.addComment(this.selectedPost._id!, comment).subscribe({
        next: (updatedPost) => {
          console.log('Comment added with response:', updatedPost);
          this.selectedPost = updatedPost;
          this.commentForm.reset();
          this.updatePost(updatedPost);
        },
        error: (error) => {
          console.error('Error adding comment:', error);
          alert('Failed to add comment');
        },
      });
    }
  }

  toggleReplyForm(comment: Comment) {
    comment.isReplying = !comment.isReplying;
    if (!comment.isReplying) {
      comment.replyContent = ''; // Reset reply content when closing form
    }
  }

  submitReply(parentComment: Comment) {
    if (!this.selectedPost || !parentComment.replyContent?.trim()) {
      console.log('Invalid reply attempt:', {
        hasSelectedPost: !!this.selectedPost,
        replyContent: parentComment.replyContent,
      });
      return;
    }

    const username =
      localStorage.getItem('username') || sessionStorage.getItem('username');

    if (!parentComment.id && parentComment.id !== 0) {
      console.error('Comment missing ID:', parentComment);
      alert('Error: Comment is missing ID');
      return;
    }

    console.log('Submitting reply:', {
      postId: this.selectedPost._id,
      commentId: parentComment.id,
      content: parentComment.replyContent,
      userEmail: this.userEmail,
    });

    this.forumService
      .addReply(this.selectedPost._id!, parentComment.id.toString(), {
        content: parentComment.replyContent.trim(),
        userEmail: this.userEmail,
        userName: this.userName,
      })
      .subscribe({
        next: (updatedPost) => {
          console.log('Reply added successfully:', updatedPost);
          this.selectedPost = updatedPost;
          parentComment.replyContent = '';
          parentComment.isReplying = false;
          this.updatePost(updatedPost);
        },
        error: (error) => {
          console.error('Error adding reply:', error);
          alert('Failed to add reply. Error: ' + error.message);
        },
      });
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
    event.stopPropagation();

    if (!post._id) {
      console.error('Post ID is missing:', post);
      return;
    }

    // Check if user has already upvoted
    if (post.upvotedBy.includes(this.userEmail)) {
      // Remove upvote
      this.forumService.upvotePost(post._id, this.userEmail).subscribe({
        next: (updatedPost) => {
          this.updatePost(updatedPost);
        },
        error: (error) => {
          console.error('Error updating vote:', error);
          alert('Failed to update vote');
        },
      });
    } else {
      // Add upvote
      this.forumService.upvotePost(post._id, this.userEmail).subscribe({
        next: (updatedPost) => {
          this.updatePost(updatedPost);
        },
        error: (error) => {
          console.error('Error updating vote:', error);
          alert('Failed to update vote');
        },
      });
    }
  }

  downvotePost(post: ForumPost, event: Event) {
    event.stopPropagation();

    if (!post._id) {
      console.error('Post ID is missing:', post);
      return;
    }

    // Check if user has already downvoted
    if (post.downvotedBy.includes(this.userEmail)) {
      // Remove downvote
      this.forumService.downvotePost(post._id, this.userEmail).subscribe({
        next: (updatedPost) => {
          this.updatePost(updatedPost);
        },
        error: (error) => {
          console.error('Error updating vote:', error);
          alert('Failed to update vote');
        },
      });
    } else {
      // Add downvote
      this.forumService.downvotePost(post._id, this.userEmail).subscribe({
        next: (updatedPost) => {
          this.updatePost(updatedPost);
        },
        error: (error) => {
          console.error('Error updating vote:', error);
          alert('Failed to update vote');
        },
      });
    }
  }

  private updatePost(updatedPost: ForumPost) {
    // Update in posts array
    const index = this.posts.findIndex((p) => p._id === updatedPost._id);
    if (index !== -1) {
      this.posts[index] = updatedPost;
      // Also update originalPosts to maintain consistency
      const originalIndex = this.originalPosts.findIndex(
        (p) => p._id === updatedPost._id
      );
      if (originalIndex !== -1) {
        this.originalPosts[originalIndex] = updatedPost;
      }
    }

    // Update selected post if in detail view
    if (this.selectedPost?._id === updatedPost._id) {
      this.selectedPost = updatedPost;
    }
  }
}
