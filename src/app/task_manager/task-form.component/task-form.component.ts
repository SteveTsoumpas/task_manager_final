import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-form.component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  taskId?: number;
  assignees: string[] = [];
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
  ) {}

  ngOnInit(): void {
    this.assignees = this.taskService.getAssignees();

    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      dueDate: ['', Validators.required],
      assignee: ['', Validators.required],
      status: ['pending', Validators.required],
      priority: ['medium', Validators.required],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.taskId = Number(id);
      const task = this.taskService.getTask(this.taskId);
      if (task) {
        this.form.patchValue(task);
      } else {
        this.router.navigate(['/tasks']);
      }
    }
  }

  get f() {
    return this.form.controls;
  }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    if (this.isEdit && this.taskId != null) {
      this.taskService.updateTask(this.taskId, this.form.value);
    } else {
      this.taskService.addTask(this.form.value);
    }
    this.router.navigate(['/tasks']);
  }

  cancel(): void {
    this.router.navigate(['/tasks']);
  }
}
