import { Component } from '@angular/core';

interface ForumPost {
  id: number;
  title: string;
  description: string;
  author: string;
  reactions: number;
  timestamp: string;
}

interface ForumCategory {
  id: number;
  name: string;
  active: boolean;
}

@Component({
  selector: 'app-forum',
  standalone: false,
  templateUrl: './forum.component.html',
  // No need for styleUrl since we're using Tailwind
})
export class ForumComponent {
  categories: ForumCategory[] = [
    { id: 1, name: 'All', active: true },
    { id: 2, name: 'Dog', active: false },
    { id: 3, name: 'Cat', active: false },
    { id: 4, name: 'Other', active: false },
  ];

  currentForum = {
    title: 'Frequently Asked Questions',
    description: 'No Text To Speech: A lot of our frequently asked questions are answered in our gitbook here: https://tits.gitbook.io/ntts-faq/ BetterDiscord FAQs: https://ntts.gitbook.io/ntts-faq/tags/tag-better...',
    pinCount: 1,
    messageCount: 2,
    newMessageCount: 2,
    lastActivity: '1m ago'
  };

  posts: ForumPost[] = [
    {
      id: 1,
      title: 'how can I find out if a edit audio is copyright or not quickly without googling?',
      description: 'so on my phone I\'ll be looking for edit audio\'s on youtube and is there a way to find out if a song or copy right or not without googling very quickly?',
      author: 'Ninjaness',
      reactions: 5,
      timestamp: '42m ago'
    }
  ];

  selectCategory(categoryId: number): void {
    this.categories.forEach(category => {
      category.active = category.id === categoryId;
    });
    // Here you would typically load the posts for the selected category
  }

  createNewPost(): void {
    // Logic to create a new post
    console.log('Creating new post');
  }
}