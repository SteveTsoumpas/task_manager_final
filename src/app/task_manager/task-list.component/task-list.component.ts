import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TaskInfo, TaskStatus } from '../task.interface';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-list.component',
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: TaskInfo[] = [];
  filtered: TaskInfo[] = [];
  assignees: string[] = [];

  filterStatus = 'all';
  filterAssignee = 'all';
  searchTerm = '';

  private sub!: Subscription;

  constructor(
    private taskService: TaskService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.assignees = this.taskService.getAssignees();
    this.sub = this.taskService.tasks$.subscribe((tasks) => {
      this.tasks = tasks;
      this.applyFilters();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  applyFilters(): void {
    this.filtered = this.tasks.filter((t) => {
      const matchStatus = this.filterStatus === 'all' || t.status === this.filterStatus;
      const matchAssignee = this.filterAssignee === 'all' || t.assignee === this.filterAssignee;
      const matchSearch =
        !this.searchTerm ||
        t.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchStatus && matchAssignee && matchSearch;
    });
  }
  viewTask(id: number): void {
    this.router.navigate(['/tasks', id]);
  }

  editTask(id: number): void {
    this.router.navigate(['/tasks', id, 'edit']);
  }

  deleteTask(task: TaskInfo): void {
    if (confirm(`Διαγραφή task "${task.title}";`)) {
      this.taskService.deleteTask(task.id);
    }
  }

  newTask(): void {
    this.router.navigate(['/tasks/new']);
  }

  statusLabel(status: TaskStatus): string {
    const map: Record<TaskStatus, string> = {
      pending: 'Εκκρεμεί',
      'in-progress': 'Σε εξέλιξη',
      completed: 'Ολοκληρώθηκε',
    };
    return map[status];
  }

  priorityLabel(priority: string): string {
    const map: Record<string, string> = {
      low: 'Χαμηλή',
      medium: 'Μεσαία',
      high: 'Υψηλή',
    };
    return map[priority] || priority;
  }

  isOverdue(task: TaskInfo): boolean {
    return task.status !== 'completed' && new Date(task.dueDate) < new Date();
  }

  get stats() {
    return {
      total: this.tasks.length,
      pending: this.tasks.filter((t) => t.status === 'pending').length,
      inProgress: this.tasks.filter((t) => t.status === 'in-progress').length,
      completed: this.tasks.filter((t) => t.status === 'completed').length,
    };
  }
}
