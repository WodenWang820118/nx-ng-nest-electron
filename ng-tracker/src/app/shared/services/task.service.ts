import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Task } from '../../interfaces/task.interface';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:5000/tasks';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.log('Error: ', error);
        return [];
      })
    );
  }

  deleteTask(task: Task): Observable<Task> {
    return this.http.delete<Task>(`${this.apiUrl}/${task.id}`).pipe(
      catchError((error) => {
        console.log('Error: ', error);
        return [];
      })
    );
  }

  udpateTaskReminder(task: Task): Observable<Task> {
    return this.http
      .put<Task>(`${this.apiUrl}/${task.id}`, task, httpOptions)
      .pipe(
        catchError((error) => {
          console.log('Error: ', error);
          return [];
        })
      );
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task, httpOptions).pipe(
      catchError((error) => {
        console.log('Error: ', error);
        return [];
      })
    );
  }
}
