import { Task, TaskStatus, TaskPriority } from '@/domains/task/types';
import { IDBAdapter } from './IDBAdapter';
import { D1Database } from '@cloudflare/workers-types';

type D1TaskRecord = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
};

const convertDateToString = (date: Date): string => {
  return date.toISOString();
};

const convertStringToDate = (dateStr: string): Date => {
  return new Date(dateStr);
};

export const createD1DBAdapter = (db: D1Database): IDBAdapter => {
  const insertTask = async (task: Task): Promise<void> => {
    const stmt = db.prepare(`
      INSERT INTO tasks (id, title, description, dueDate, status, priority, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    await stmt
      .bind(
        task.id,
        task.title,
        task.description,
        convertDateToString(task.dueDate),
        task.status,
        task.priority,
        convertDateToString(task.createdAt),
        convertDateToString(task.updatedAt)
      )
      .run();
  };

  const findTaskById = async (id: string): Promise<Task | null> => {
    const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?').bind(id);
    const row = await stmt.first<D1TaskRecord>();

    if (!row) return null;

    return {
      ...row,
      dueDate: convertStringToDate(row.dueDate),
      createdAt: convertStringToDate(row.createdAt),
      updatedAt: convertStringToDate(row.updatedAt),
    };
  };

  const updateTask = async (id: string, task: Partial<Task>): Promise<Task | null> => {
    const currentTask = await findTaskById(id);
    if (!currentTask) return null;

    const updateFields = [];
    const values = [];
    
    if (task.title !== undefined) {
      updateFields.push('title = ?');
      values.push(task.title);
    }
    if (task.description !== undefined) {
      updateFields.push('description = ?');
      values.push(task.description);
    }
    if (task.dueDate !== undefined) {
      updateFields.push('dueDate = ?');
      values.push(convertDateToString(task.dueDate));
    }
    if (task.status !== undefined) {
      updateFields.push('status = ?');
      values.push(task.status);
    }
    if (task.priority !== undefined) {
      updateFields.push('priority = ?');
      values.push(task.priority);
    }

    updateFields.push('updatedAt = ?');
    values.push(convertDateToString(new Date()));
    values.push(id);

    const stmt = db.prepare(`
      UPDATE tasks
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `);

    await stmt.bind(...values).run();
    return findTaskById(id);
  };

  const removeTask = async (id: string): Promise<void> => {
    await db.prepare('DELETE FROM tasks WHERE id = ?').bind(id).run();
  };

  const listTasks = async (): Promise<Task[]> => {
    const { results } = await db.prepare('SELECT * FROM tasks').all<D1TaskRecord>();

    return results.map(row => ({
      ...row,
      dueDate: convertStringToDate(row.dueDate),
      createdAt: convertStringToDate(row.createdAt),
      updatedAt: convertStringToDate(row.updatedAt),
    }));
  };

  return {
    insertTask,
    findTaskById,
    updateTask,
    removeTask,
    listTasks,
  };
};
