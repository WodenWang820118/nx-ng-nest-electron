import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../../interfaces/task.interface';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { NgClass, NgStyle } from '@angular/common';
import { TaskService } from '../../../shared/services/task.service';
import { take, tap } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [NgClass, NgStyle, FontAwesomeModule],
  template: `
    <div
      data-test-id="task-card"
      [ngClass]="{ reminder: task.reminder }"
      class="task"
      (dblclick)="toggleReminder(task)"
    >
      <h3>
        {{ task.text }}
        <fa-icon
          data-test-id="delete-task"
          (click)="deleteTask(task)"
          [ngStyle]="{ color: 'red' }"
          [icon]="faTimes"
        >
        </fa-icon>
      </h3>
      <p>{{ task.day }}</p>
    </div>
  `,
  styles: [
    `
      .task {
        background: #f4f4f4;
        margin: 5px;
        padding: 10px 20px;
        cursor: pointer;
      }

      .task.reminder {
        border-left: 5px solid green;
      }

      .task h3 {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    `,
  ],
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() taskChanged = new EventEmitter<void>();
  faTimes = faTimes;

  constructor(private taskService: TaskService) {}

  deleteTask(task: Task): void {
    this.taskService
      .deleteTask(task)
      .pipe(
        take(1),
        tap(() => this.taskChanged.emit())
      )
      .subscribe();
  }

  toggleReminder(task: Task): void {
    task.reminder = !task.reminder;
    this.taskService.udpateTaskReminder(task).pipe(take(1)).subscribe();
  }
}
