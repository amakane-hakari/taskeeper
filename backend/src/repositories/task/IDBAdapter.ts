import { Task } from '@/domains/task/types';

export interface IDBAdapter {
  insertTask(task: Task): Promise<void>;
  findTaskById(id: string): Promise<Task | null>;
  updateTask(id: string, task: Partial<Task>): Promise<Task | null>;
  removeTask(id: string): Promise<void>;
  listTasks(): Promise<Task[]>;
}
