import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-banner',
  standalone: false,
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css',
})
export class BannerComponent {
  activeSlide = 0;
  ads = ['./1.png', './2.png', './3.png', './4.png'];

  ngOnInit() {
    console.log('Ads:', this.ads); // Debugging line
    // Auto-advance every 5 seconds
    setInterval(() => this.nextSlide(), 5000);
  }

  previousSlide() {
    this.activeSlide =
      this.activeSlide === 0 ? this.ads.length - 1 : this.activeSlide - 1;
  }

  nextSlide() {
    this.activeSlide =
      this.activeSlide === this.ads.length - 1 ? 0 : this.activeSlide + 1;
  }

  goToSlide(index: number) {
    this.activeSlide = index;
  }
}
