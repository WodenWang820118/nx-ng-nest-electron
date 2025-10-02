import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Task } from '../../interfaces/task.interface';
import { environment } from '../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private readonly http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(environment.taskApiUrl).pipe(
      catchError((error) => {
        console.log('Error: ', error);
        return [];
      })
    );
  }

  deleteTask(task: Task): Observable<Task> {
    return this.http.delete<Task>(`${environment.taskApiUrl}/${task.id}`).pipe(
      catchError((error) => {
        console.log('Error: ', error);
        return [];
      })
    );
  }

  updateTaskReminder(task: Task): Observable<Task> {
    return this.http
      .put<Task>(`${environment.taskApiUrl}/${task.id}`, task, httpOptions)
      .pipe(
        catchError((error) => {
          console.log('Error: ', error);
          return [];
        })
      );
  }

  addTask(task: Task): Observable<Task> {
    return this.http
      .post<Task>(`${environment.taskApiUrl}/create`, task, httpOptions)
      .pipe(
        catchError((error) => {
          console.log('Error: ', error);
          return [];
        })
      );
  }
}
