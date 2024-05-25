import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, AsyncPipe, RouterLink],
  template: `
    <header>
      <h1>{{ title }}</h1>
      @if (hasRoute('/')) {
      <button
        data-test-id="btn-add-task"
        style="background-color: green"
        class="btn"
        [routerLink]="['/', 'add-task']"
      >
        Add
      </button>
      }
    </header>
  `,
  styles: [
    `
      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
    `,
  ],
})
export class HeaderComponent {
  title: string = 'Task Tracker';

  constructor(private router: Router) {}

  hasRoute(route: string) {
    return this.router.url === route;
  }
}
