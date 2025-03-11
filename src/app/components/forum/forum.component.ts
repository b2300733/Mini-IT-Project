import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Comment {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  replies: Comment[];
  isReplying: boolean;
}

interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: string;
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
})
export class ForumComponent implements OnInit {
  categories: string[] = ['All', 'Dog', 'Cat', 'Other'];
  selectedCategory: string = 'All';
  showNewPostForm = false;
  postForm: FormGroup;
  commentForm: FormGroup;
  replyForm: FormGroup;
  private originalPosts: ForumPost[] = [];
  posts: ForumPost[] = [];
  selectedPost: ForumPost | null = null;
  isDetailView = false;

  constructor(private fb: FormBuilder) {
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
    // Create sample posts with comments
    this.posts = [
      {
        id: 1,
        title: 'Need advice for my new puppy',
        content:
          'Just got a new Golden Retriever puppy. Any tips for first-time dog owners?',
        author: 'dogLover123',
        upvotes: 15,
        downvotes: 2,
        commentCount: 2,
        timestamp: '2 hours ago',
        category: 'Dog',
        comments: [
          {
            id: 1,
            author: 'PuppyExpert',
            content: 'Make sure to start training early! Consistency is key.',
            timestamp: '1 hour ago',
            replies: [
              {
                id: 3,
                author: 'dogLover123',
                content:
                  'Thanks for the advice! Any specific training methods you recommend?',
                timestamp: '45 minutes ago',
                replies: [],
                isReplying: false,
              },
            ],
            isReplying: false,
          },
          {
            id: 2,
            author: 'VetTech42',
            content:
              'Schedule a vet visit within the first week. Also, make sure to puppy-proof your home!',
            timestamp: '30 minutes ago',
            replies: [],
            isReplying: false,
          },
        ],
      },
      {
        id: 2,
        title: 'My cat keeps knocking things off shelves',
        content:
          'My 2-year-old tabby has developed a habit of pushing everything off every surface. Help!',
        author: 'CatParent',
        upvotes: 8,
        downvotes: 1,
        commentCount: 1,
        timestamp: '3 hours ago',
        category: 'Cat',
        comments: [
          {
            id: 4,
            author: 'CatBehaviorist',
            content: 'OMG Is 100 teeth dinasour',
            timestamp: '2 hours ago',
            replies: [],
            isReplying: false,
          },
        ],
      },
    ];

    // Store original posts
    this.originalPosts = [...this.posts];
  }

  toggleNewPost() {
    this.showNewPostForm = !this.showNewPostForm;
  }

  submitPost() {
    if (this.postForm.valid) {
      const newPost: ForumPost = {
        id: this.posts.length + 1,
        ...this.postForm.value,
        author: 'CurrentUser', // Replace with actual logged-in user
        upvotes: 0,
        downvotes: 0,
        commentCount: 0,
        timestamp: 'Just now',
        comments: [],
      };
      this.posts.unshift(newPost);
      this.originalPosts = [...this.posts];
      this.postForm.reset();
      this.showNewPostForm = false;
    }
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;

    if (category === 'All') {
      this.posts = [...this.originalPosts];
      return;
    }

    this.posts = this.originalPosts.filter(
      (post) => post.category === category
    );
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
        post.author.toLowerCase().includes(searchTerm)
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
        author: 'CurrentUser', // Replace with actual logged-in user
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
        author: 'CurrentUser', // Replace with actual logged-in user
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
