import { Task, TaskStatus, TaskPriority } from '@/domains/task/types';
import { IDBAdapter } from './IDBAdapter';
import Database from 'better-sqlite3';

type SQLiteTaskRecord = {
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

const initializeDatabase = (db: Database.Database) => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      dueDate TEXT NOT NULL,
      status TEXT NOT NULL,
      priority TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);
};

export const createSqliteDBAdapter = (dbPath?: string): IDBAdapter => {
  const db = new Database(dbPath || ':memory:');
  initializeDatabase(db);

  const insertTask = async (task: Task): Promise<void> => {
    const stmt = db.prepare(`
      INSERT INTO tasks (id, title, description, dueDate, status, priority, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      task.id,
      task.title,
      task.description,
      convertDateToString(task.dueDate),
      task.status,
      task.priority,
      convertDateToString(task.createdAt),
      convertDateToString(task.updatedAt)
    );
  };

  const findTaskById = async (id: string): Promise<Task | null> => {
    const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
    const row = stmt.get(id) as SQLiteTaskRecord | undefined;

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

    stmt.run(...values);
    return findTaskById(id);
  };

  const removeTask = async (id: string): Promise<void> => {
    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    stmt.run(id);
  };

  const listTasks = async (): Promise<Task[]> => {
    const stmt = db.prepare('SELECT * FROM tasks');
    const rows = stmt.all() as SQLiteTaskRecord[];

    return rows.map(row => ({
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
