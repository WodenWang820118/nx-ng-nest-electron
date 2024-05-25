import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer>
      <p>Copyright 2024</p>
      @if(!hasRoute('/about')) {
      <a data-test-id="about-link" [routerLink]="['/', 'about']">About</a>
      }
    </footer>
  `,
  styles: [
    `
      footer {
        margin-top: 30px;
        text-align: center;
      }
    `,
  ],
})
export class FooterComponent {
  constructor(private router: Router) {}

  hasRoute(route: string) {
    return this.router.url === route;
  }
}
