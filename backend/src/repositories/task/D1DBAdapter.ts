import { Task } from '@/domains/task/types';
import { IDBAdapter } from './IDBAdapter';
import { D1Database } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { tasks, type NewTask } from '@/schema';

const convertDateToString = (date: Date): string => {
  return date.toISOString();
};

const convertStringToDate = (dateStr: string): Date => {
  return new Date(dateStr);
};

export const createD1DBAdapter = (d1db: D1Database): IDBAdapter => {
  const db = drizzle(d1db);

  const insertTask = async (task: Task): Promise<void> => {
    const newTask: NewTask = {
      id: task.id,
      title: task.title,
      description: task.description ?? '',  // デフォルト値を設定
      dueDate: convertDateToString(task.dueDate),
      status: task.status,
      priority: task.priority,
      createdAt: convertDateToString(task.createdAt),
      updatedAt: convertDateToString(task.updatedAt),
    };

    await db.insert(tasks).values(newTask);
  };

  const findTaskById = async (id: string): Promise<Task | null> => {
    const result = await db.select().from(tasks).where(eq(tasks.id, id));
    
    if (result.length === 0) return null;
    
    const row = result[0];
    return {
      ...row,
      description: row.description || undefined,  // 空文字列の場合はundefinedに変換
      dueDate: convertStringToDate(row.dueDate),
      createdAt: convertStringToDate(row.createdAt),
      updatedAt: convertStringToDate(row.updatedAt),
    };
  };

  const updateTask = async (id: string, task: Partial<Task>): Promise<Task | null> => {
    const updateData: Partial<NewTask> = {};
    
    if (task.title !== undefined) updateData.title = task.title;
    if (task.description !== undefined) updateData.description = task.description;
    if (task.dueDate !== undefined) updateData.dueDate = convertDateToString(task.dueDate);
    if (task.status !== undefined) updateData.status = task.status;
    if (task.priority !== undefined) updateData.priority = task.priority;
    updateData.updatedAt = convertDateToString(new Date());

    await db.update(tasks)
      .set(updateData)
      .where(eq(tasks.id, id));

    return findTaskById(id);
  };

  const removeTask = async (id: string): Promise<void> => {
    await db.delete(tasks).where(eq(tasks.id, id));
  };

  const listTasks = async (): Promise<Task[]> => {
    const rows = await db.select().from(tasks);
    
    return rows.map(row => ({
      ...row,
      description: row.description || undefined,  // 空文字列の場合はundefinedに変換
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
