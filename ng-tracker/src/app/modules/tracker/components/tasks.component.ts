import { Component, computed, signal } from '@angular/core';
import { TaskService } from '../../../shared/services/task.service';
import { Task } from '../../../interfaces/task.interface';
import { TaskItemComponent } from './task-item.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-tasks',
  imports: [
    TaskItemComponent,
    InputTextModule,
    ButtonModule,
    FormsModule,
    RouterLink,
    IconFieldModule,
    InputIconModule,
  ],
  template: `
    <div class="px-1 md:px-2 lg:px-3">
      <div
        class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between py-4"
      >
        <h2 class="text-xl font-semibold text-gray-800 dark:text-slate-100">
          Your Tasks
        </h2>
        <div class="flex items-center gap-2 w-full md:w-auto">
          <span class="relative flex-1 md:flex-none">
            <p-icon-field>
              <p-inputicon class="pi pi-search" />
              <input
                pInputText
                type="text"
                [(ngModel)]="query"
                placeholder="Search tasks..."
              />
            </p-icon-field>
          </span>
          <a [routerLink]="['/add-task']">
            <p-button label="Add Task" icon="pi pi-plus" severity="success" />
          </a>
        </div>
      </div>

      @if (loading()) {
      <div class="flex justify-center items-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"
        ></div>
      </div>
      } @if (error()) {
      <div
        class="bg-red-50 dark:bg-red-950 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg mb-4"
        role="alert"
      >
        <strong class="font-bold">Error:</strong>
        <span class="block sm:inline ml-2">{{ error() }}</span>
      </div>
      } @if (!loading() && !error() && filteredTasks().length === 0) {
      <div class="text-center py-12">
        <p class="text-gray-500 dark:text-slate-400 text-lg">
          No tasks yet. Add one to get started!
        </p>
      </div>
      }
      <div class="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        @for (task of filteredTasks(); track task.id) {
        <app-task-item
          [task]="task"
          (taskChanged)="refreshTasks()"
        ></app-task-item>
        }
      </div>
    </div>
  `,
})
export class TasksComponent {
  // State signals
  tasks = signal<Task[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  query = '';
  filteredTasks = computed(() => {
    const q = this.query.trim().toLowerCase();
    if (!q) return this.tasks();
    return this.tasks().filter((t) => {
      const textMatch = t.text.toLowerCase().includes(q);
      const dateStr = t.day
        ? new Date(t.day).toLocaleString().toLowerCase()
        : '';
      const dateMatch = dateStr.includes(q);
      return textMatch || dateMatch;
    });
  });

  constructor(private taskService: TaskService) {
    // Initial load
    this.loadTasks();
  }

  private loadTasks(): void {
    this.loading.set(true);
    this.error.set(null);

    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(
          err instanceof Error ? err.message : 'An error occurred'
        );
        this.loading.set(false);
      },
    });
  }

  refreshTasks(): void {
    this.loadTasks();
  }
}
