import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ForumService } from '../../../../backend/services/forum.service';

interface Comment {
  id: number;
  userEmail: string;
  userName: string; // Add this line
  userAvatar: string;
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
  userAvatar: string;
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
  userAvatar: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private forumService: ForumService
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
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
      localStorage.getItem('username') ||
      sessionStorage.getItem('username') ||
      '';
  }

  ngOnInit() {
    this.fetchForumPosts();
    this.userAvatar =
      localStorage.getItem('avatar') ||
      sessionStorage.getItem('avatar') ||
      'assets/images/default_user.png';
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

  handleCreatePostClick(event: Event): void {
    if (!this.isLoggedIn()) {
      event.preventDefault();
      event.stopPropagation();
      // Show login prompt
      alert('Please log in to create a post');
      this.router.navigate(['/login']);
      return;
    }

    this.toggleNewPost();
  }

  handleCommentSubmit(): void {
    if (!this.isLoggedIn()) {
      alert('Please log in to comment');
      this.router.navigate(['/login']);
      return;
    }

    this.submitComment();
  }

  handleReplyClick(comment: Comment, event: Event): void {
    if (!this.isLoggedIn()) {
      event.preventDefault();
      event.stopPropagation();
      alert('Please log in to reply');
      this.router.navigate(['/login']);
      return;
    }

    this.toggleReplyForm(comment);
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
      const avatar =
        localStorage.getItem('avatar') ||
        sessionStorage.getItem('avatar') ||
        'assets/images/default_user.png';

      if (!userEmail || !username) {
        alert('Please login first to create a post');
        this.router.navigate(['/login']);
        return;
      }

      // Show loading indicator or disable button
      const submitBtn = document.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.setAttribute('disabled', 'true');
        submitBtn.textContent = 'Posting...';
      }

      const postData: Omit<ForumPost, 'id'> = {
        title: this.postForm.value.title.trim(),
        content: this.postForm.value.content.trim(),
        category: this.postForm.value.category,
        userEmail: userEmail,
        userName: username,
        userAvatar: avatar,
        upvotes: 0,
        downvotes: 0,
        commentCount: 0,
        comments: [],
        upvotedBy: [],
        downvotedBy: [],
        timestamp: new Date().toISOString(),
      };

      console.log('Sending post data with avatar:', postData);

      this.forumService.createPost(postData).subscribe({
        next: (newPost) => {
          console.log('Post created successfully:', newPost);

          // Add success message
          alert('Post created successfully!');

          // Add the new post to the beginning of the posts array
          this.posts.unshift(newPost);
          this.originalPosts.unshift(newPost);

          // Reset form and hide new post form
          this.resetListingForm();
          this.showNewPostForm = false;

          // Re-enable submit button
          if (submitBtn) {
            submitBtn.removeAttribute('disabled');
            submitBtn.textContent = 'Post';
          }
        },
        error: (error) => {
          console.error('Error creating post:', error);
          alert('Failed to create post. Please try again.');

          // Re-enable submit button
          if (submitBtn) {
            submitBtn.removeAttribute('disabled');
            submitBtn.textContent = 'Post';
          }
        },
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
      const userAvatar =
        localStorage.getItem('avatar') ||
        sessionStorage.getItem('avatar') ||
        'assets/images/default_user.png';

      const comment = {
        content: this.commentForm.value.content.trim(),
        userEmail: this.userEmail,
        userName: this.userName,
        userAvatar: userAvatar,
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
    if (!this.isLoggedIn()) {
      alert('Please log in to reply');
      this.router.navigate(['/login']);
      return;
    }

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

    const avatar =
      localStorage.getItem('avatar') ||
      sessionStorage.getItem('avatar') ||
      'assets/images/default_user.png';

    this.forumService
      .addReply(this.selectedPost._id!, parentComment.id.toString(), {
        content: parentComment.replyContent.trim(),
        userEmail: this.userEmail,
        userName: this.userName,
        userAvatar: avatar,
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

  confirmDeletePost() {
    if (!this.selectedPost) return;

    // Ask for confirmation
    const confirmDelete = confirm(
      'Are you sure you want to delete this post? This action cannot be undone.'
    );

    if (confirmDelete) {
      this.deletePost();
    }
  }

  deletePost() {
    if (!this.selectedPost || !this.selectedPost._id) return;

    // Show loading state
    const deleteBtn = document.querySelector('button.text-red-500');
    if (deleteBtn) {
      deleteBtn.setAttribute('disabled', 'true');
      deleteBtn.innerHTML =
        '<svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"></svg> Deleting...';
    }

    this.forumService.deletePost(this.selectedPost._id).subscribe({
      next: () => {
        // Remove from posts arrays
        this.posts = this.posts.filter(
          (post) => post._id !== this.selectedPost?._id
        );
        this.originalPosts = this.originalPosts.filter(
          (post) => post._id !== this.selectedPost?._id
        );

        // Show success message
        alert('Post deleted successfully');

        // Go back to listing view
        this.backToListing();
      },
      error: (error) => {
        console.error('Error deleting post:', error);
        alert('Failed to delete post. Please try again.');

        // Reset button state
        if (deleteBtn) {
          deleteBtn.removeAttribute('disabled');
          deleteBtn.innerHTML =
            '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg> Delete Post';
        }
      },
    });
  }

  calculateTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());

    const diffSeconds = Math.floor(diffTime / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return `Just now`;
    }
  }
}
