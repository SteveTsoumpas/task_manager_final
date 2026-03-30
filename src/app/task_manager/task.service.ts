import { Injectable } from '@angular/core';
import { TaskInfo, TaskStatus, TaskPriority } from './task.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private nextId = 2;

  private tasks: TaskInfo[] = [];

  private initialTasks: TaskInfo[] = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Review and sign all employment contract documents provided by HR.',
      dueDate: '2025-04-05',
      assignee: 'Stefanos Tsoumpas',
      status: 'completed',
      priority: 'high',
      createdAt: '2025-03-20',
    },
  ];


  private tasksSubject = new BehaviorSubject<TaskInfo[]>(this.initialTasks);


  tasks$: Observable<TaskInfo[]> = this.tasksSubject.asObservable();

  getAssignees(): string[] {
    return ['Stefanos Tsoumpas'];
  }

  getTasks(): TaskInfo[] {
    return this.tasksSubject.getValue();
  }

  getTask(id: number): TaskInfo | undefined {
    return this.tasksSubject.getValue().find((t) => t.id === id);
  }

  addTask(task: Omit<TaskInfo, 'id' | 'createdAt'>): TaskInfo {
    const newTask: TaskInfo = {
      ...task,
      id: this.nextId++,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.tasksSubject.next([...this.getTasks(), newTask]);
    return newTask;
  }

  updateTask(id: number, changes: Partial<Omit<TaskInfo, 'id' | 'createdAt'>>): void {
    const updated = this.getTasks().map((t) => (t.id === id ? { ...t, ...changes } : t));
    this.tasksSubject.next(updated);
  }

  deleteTask(id: number): void {
    this.tasksSubject.next(this.getTasks().filter((t) => t.id !== id));
  }
}
