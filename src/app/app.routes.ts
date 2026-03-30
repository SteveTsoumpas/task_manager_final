import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { TaskListComponent } from './task_manager/task-list.component/task-list.component';
import { TaskDetailComponent } from './task_manager/task-detail.component/task-detail.component';
import { TaskFormComponent } from './task_manager/task-form.component/task-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'tasks', component: TaskListComponent },
  { path: 'tasks/new', component: TaskFormComponent },
  { path: 'tasks/:id', component: TaskDetailComponent },
  { path: 'tasks/:id/edit', component: TaskFormComponent },
  { path: '**', redirectTo: 'tasks' },
];

