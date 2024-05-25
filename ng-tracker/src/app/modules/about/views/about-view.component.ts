import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-view',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="about">
      <div>
        <h2>Task Tracker</h2>
        <h4>Version: 1.0.0</h4>
        <a data-test-id="home-page-link" [routerLink]="['/']">Home</a>
      </div>
    </div>
  `,
  styles: [
    `
      .about {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
})
export class AboutViewComponent {}
