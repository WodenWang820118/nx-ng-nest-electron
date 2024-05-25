import { Component } from '@angular/core';
import { Task } from '../../../interfaces/task.interface';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../../shared/services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  template: `
    <form
      [formGroup]="taskForm"
      (ngSubmit)="onSubmit()"
      data-test-id="add-task-form"
      class="add-form"
    >
      <div class="form-control">
        <label for="text" data-testid="label-task">Task</label>
        <input
          type="text"
          name="text"
          formControlName="text"
          id="text"
          placeholder="Add Task"
          data-test-id="input-task"
        />
      </div>
      <div class="form-control">
        <label for="day" data-test-id="label-time">Day & Time</label>
        <input
          data-test-id="input-time"
          type="text"
          name="day"
          formControlName="day"
          id="day"
          placeholder="Add Day & Time"
        />
      </div>
      <div class="form-control form-control-check">
        <label for="reminder" data-test-id="label-reminder">Set Reminder</label>
        <input
          data-test-id="input-reminder"
          type="checkbox"
          name="reminder"
          formControlName="reminder"
          id="reminder"
        />
      </div>
      <div class="actions">
        <input
          data-test-id="input-cancel-task"
          value="Cancel"
          class="btn cancel"
          id="cancelButton"
          (click)="cancelAddTask()"
        />
        <input
          data-test-id="input-save-task"
          type="submit"
          value="Save Task"
          class="btn"
          id="submitButton"
        />
      </div>
    </form>
  `,
  styles: [
    `
      .add-form {
        margin-bottom: 40px;
      }

      .actions {
        display: flex;
        justify-content: space-between;
      }
    `,
  ],
})
export class TaskFormComponent {
  taskForm = this.fb.group({
    text: [''],
    day: [''],
    reminder: [false],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private taskService: TaskService
  ) {}

  cancelAddTask() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    if (!this.taskForm.value.text || !this.taskForm.value.day) {
      alert('Please fill all fields');
      return;
    }

    const newTask = {
      text: this.taskForm.value.text,
      day: this.taskForm.value.day,
      reminder: this.taskForm.value.reminder || false,
    };

    this.taskService.addTask(newTask).subscribe(
      (task: Task) => {
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Error adding task:', error);
      }
    );
  }
}
