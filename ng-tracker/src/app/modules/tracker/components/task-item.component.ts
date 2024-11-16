import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Task } from '../../../interfaces/task.interface';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { NgClass, NgStyle } from '@angular/common';
import { TaskService } from '../../../shared/services/task.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { take } from 'rxjs';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [NgClass, NgStyle, FontAwesomeModule],
  template: `
    <div
      data-test-id="task-card"
      [ngClass]="{ reminder: task().reminder }"
      class="task"
      (dblclick)="toggleReminder(taskSignal())"
    >
      <h3>
        {{ task().text }}
        <fa-icon
          data-test-id="delete-task"
          (click)="deleteTask(taskSignal())"
          [ngStyle]="{ color: 'red' }"
          [icon]="faTimes"
        >
        </fa-icon>
      </h3>
      <p>{{ task().day }}</p>
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemComponent {
  task = input.required<Task>();
  taskChanged = output<void>();
  faTimes = faTimes;
  taskSignal = computed(() => this.task());

  constructor(private taskService: TaskService) { }

  deleteTask(task: Task): void {
    this.taskService
      .deleteTask(task)
      .pipe(take(1))
      .subscribe(() => {
        this.taskChanged.emit();
      });
  }

  toggleReminder(task: Task): void {
    task.reminder = !task.reminder;
    const updatedTask = { ...task, reminder: task.reminder };
    this.taskService.updateTaskReminder(updatedTask).pipe(
      take(1),
    ).subscribe();
  }
}
