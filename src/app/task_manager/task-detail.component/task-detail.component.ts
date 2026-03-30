import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskInfo, TaskStatus } from '../task.interface';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-detail.component',
  imports: [CommonModule],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css',
})
export class TaskDetailComponent implements OnInit {
  task: TaskInfo | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.task = this.taskService.getTask(id);
    if (!this.task) this.router.navigate(['/tasks']);
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  edit(): void {
    this.router.navigate(['/tasks', this.task!.id, 'edit']);
  }

  delete(): void {
    if (confirm(`Διαγραφή task "${this.task!.title}";`)) {
      this.taskService.deleteTask(this.task!.id);
      this.router.navigate(['/tasks']);
    }
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
    const map: Record<string, string> = { low: 'Χαμηλή', medium: 'Μεσαία', high: 'Υψηλή' };
    return map[priority] || priority;
  }

  isOverdue(): boolean {
    return (
      !!this.task && this.task.status !== 'completed' && new Date(this.task.dueDate) < new Date()
    );
  }
}
