import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { TaskService } from '../../../shared/services/task.service';
import { Task } from '../../../interfaces/task.interface';
import { TaskItemComponent } from './task-item.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [AsyncPipe, TaskItemComponent],
  template: `
    @for (task of (tasks$ | async); track task.id) {
    <app-task-item [task]="task" (taskChanged)="refreshTasks()"></app-task-item>
    }
  `,
})
export class TasksComponent {
  tasks$: Observable<Task[]>;

  constructor(private taskService: TaskService) {
    this.tasks$ = this.taskService.getTasks();
  }

  refreshTasks() {
    this.tasks$ = this.taskService.getTasks();
  }
}
