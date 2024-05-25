import { Component } from '@angular/core';
import { TaskFormComponent } from '../components/task-form.component';
import { FooterComponent } from '../../../shared/components/footer.component';

@Component({
  selector: 'app-add-task-view',
  standalone: true,
  imports: [TaskFormComponent, FooterComponent],
  template: `
    <app-task-form></app-task-form>
    <app-footer></app-footer>
  `,
})
export class AddTaskViewComponent {}
