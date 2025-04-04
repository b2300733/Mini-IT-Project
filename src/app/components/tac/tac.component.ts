import { Component } from '@angular/core';

@Component({
  selector: 'app-tac',
  standalone: false,
  templateUrl: './tac.component.html',
  styleUrl: './tac.component.css',
})
export class TacComponent {
  closeWindow(): void {
    window.close();
  }
}
