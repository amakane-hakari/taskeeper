import { Result } from "../../shared/Result";

// Domain Errors
export class TaskValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TaskValidationError";
  }
}

export class TaskNotFoundError extends Error {
  constructor(taskId: string) {
    super(`Task with id ${taskId} not found`);
    this.name = "TaskNotFoundError";
  }
}

export class TaskStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TaskStorageError";
  }
}

export type TaskError = TaskValidationError | TaskNotFoundError | TaskStorageError;

// Domain Types
export type TaskStatus = 'not_started' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  updatedAt: Date;
}

// DTOs
export interface CreateTaskDTO {
  title: string;
  description?: string;
  dueDate: Date;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  dueDate?: Date;
  status?: TaskStatus;
  priority?: TaskPriority;
}

// Repository Interface
export interface TaskRepository {
  create(task: CreateTaskDTO): Promise<Result<Task, TaskError>>;
  findById(id: string): Promise<Result<Task, TaskError>>;
  update(id: string, task: UpdateTaskDTO): Promise<Result<Task, TaskError>>;
  remove(id: string): Promise<Result<void, TaskError>>;
  list(): Promise<Result<Task[], TaskError>>;
}
