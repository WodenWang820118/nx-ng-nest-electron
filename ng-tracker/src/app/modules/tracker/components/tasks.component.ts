import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TaskService } from '../../../shared/services/task.service';
import { Task } from '../../../interfaces/task.interface';
import { TaskItemComponent } from './task-item.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TaskItemComponent],
  template: `
    @if (loading()) {
      <div>Loading...</div>
    }
    @if (error()) {
      <div class="error">Error: {{ error() }}</div>
    }
    @for (task of tasks(); track task.id) {
      <app-task-item
        [task]="task"
        (taskChanged)="refreshTasks()"
      ></app-task-item>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent {
  // State signals
  tasks = signal<Task[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private taskService: TaskService) {
    // Initial load
    this.loadTasks();
  }

  private async loadTasks(): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);

      const tasks = await firstValueFrom(this.taskService.getTasks());
      this.tasks.set(tasks);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      this.loading.set(false);
    }
  }

  async refreshTasks(): Promise<void> {
    await this.loadTasks();
  }
}
