import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Hono } from 'hono';
import { createTasksRouter } from '../tasks';
import { createMockTaskRepository } from '@/test/repositories/MockTaskRepository';
import { Task, TaskNotFoundError, TaskStorageError } from '@/domains/task/types';
import { Env, Variables, createDIMiddleware } from '@/di/container';
import { Result } from '@/shared/Result';

interface TaskResponse {
  tasks: Task[];
}

interface ErrorResponse {
  message: string;
}

interface CreateTaskResponse {
  task: Task;
}

describe('Tasks API', () => {
  let app: Hono<{ Bindings: Env; Variables: Variables }>;
  let diMiddleware: ReturnType<typeof createDIMiddleware>;
  let taskRepository: ReturnType<typeof createMockTaskRepository>;

  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    // テスト用のエラーログを抑制
    originalConsoleError = console.error;
    console.error = vi.fn((message) => {
      // 意図的なテストエラーは抑制（但し予期しないエラーは表示）
      if (typeof message === 'string' && 
          (message.includes('Error fetching tasks:') ||
           message.includes('Error creating task:') ||
           message.includes('Error deleting task:'))) {
        return; // 抑制
      }
      originalConsoleError(message); // その他は表示
    });

    taskRepository = createMockTaskRepository();
    diMiddleware = async (c, next) => {
      c.set('taskRepository', taskRepository);
      await next();
    };

    app = new Hono();
    app.use('*', diMiddleware);
    app.route('/tasks', createTasksRouter());
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  describe('GET /tasks', () => {
    it('タスク一覧を取得できること', async () => {
      const res = await app.request('/tasks');
      expect(res.status).toBe(200);

      const data = await res.json() as TaskResponse;
      expect(data).toEqual({
        tasks: [
          {
            id: '1',
            title: 'タスク1',
            description: 'テストタスク1の説明',
            dueDate: '2025-12-31T00:00:00.000Z',
            status: 'not_started',
            priority: 'medium',
            createdAt: '2025-03-07T00:00:00.000Z',
            updatedAt: '2025-03-07T00:00:00.000Z',
          },
          {
            id: '2',
            title: 'タスク2',
            description: 'テストタスク2の説明',
            dueDate: '2025-12-31T00:00:00.000Z',
            status: 'completed',
            priority: 'high',
            createdAt: '2025-03-07T00:00:00.000Z',
            updatedAt: '2025-03-07T00:00:00.000Z',
          },
        ],
      });
    });

    it('リポジトリでエラーが発生した場合は500エラーを返すこと', async () => {
      vi.spyOn(taskRepository, 'list').mockImplementation(() => Promise.resolve(Result.err(new Error('Database error'))));
      
      const res = await app.request('/tasks');
      expect(res.status).toBe(500);
      
      const data = await res.json() as ErrorResponse;
      expect(data.message).toBe('Internal Server Error');
    });

    it('ストレージエラーの場合はエラーメッセージを返すこと', async () => {
      vi.spyOn(taskRepository, 'list').mockImplementation(() => 
        Promise.resolve(Result.err(new TaskStorageError('Database connection failed')))
      );
      
      const res = await app.request('/tasks');
      expect(res.status).toBe(500);
      
      const data = await res.json() as ErrorResponse;
      expect(data.message).toBe('Database connection failed');
    });
  });

  describe('POST /tasks', () => {
    it('タスクを作成できること', async () => {
      const newTask = {
        title: '新規タスク',
        description: '新規タスクの説明',
        dueDate: '2025-12-31T00:00:00.000Z',
      };

      const res = await app.request('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      expect(res.status).toBe(201);
      const data = await res.json() as CreateTaskResponse;
      expect(data.task).toMatchObject(newTask);
    });

    it('タイトルが未入力の場合は400エラーを返すこと', async () => {
      const invalidTask = {
        description: '説明のみ',
        dueDate: '2025-12-31T00:00:00.000Z',
      };

      const res = await app.request('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidTask),
      });

      expect(res.status).toBe(400);
      const data = await res.json() as ErrorResponse;
      expect(data.message).toBe('Title is required');
    });

    it('ストレージエラーの場合はエラーメッセージを返すこと', async () => {
      const newTask = {
        title: '新規タスク',
        description: '新規タスクの説明',
        dueDate: '2025-12-31T00:00:00.000Z',
      };

      vi.spyOn(taskRepository, 'create').mockImplementation(() =>
        Promise.resolve(Result.err(new TaskStorageError('Failed to insert task')))
      );

      const res = await app.request('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      expect(res.status).toBe(500);
      const data = await res.json() as ErrorResponse;
      expect(data.message).toBe('Failed to insert task');
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('タスクを削除できること', async () => {
      const res = await app.request('/tasks/1', {
        method: 'DELETE',
      });

      expect(res.status).toBe(204);
    });

    it('存在しないタスクの削除は404エラーを返すこと', async () => {
      vi.spyOn(taskRepository, 'remove').mockImplementation(() =>
        Promise.resolve(Result.err(new TaskNotFoundError('non-existent'))));

      const res = await app.request('/tasks/non-existent', {
        method: 'DELETE',
      });

      expect(res.status).toBe(404);
      const data = await res.json() as ErrorResponse;
      expect(data.message).toBe('Task not found');
    });

    it('ストレージエラーの場合はエラーメッセージを返すこと', async () => {
      vi.spyOn(taskRepository, 'remove').mockImplementation(() =>
        Promise.resolve(Result.err(new TaskStorageError('Failed to delete task')))
      );

      const res = await app.request('/tasks/1', {
        method: 'DELETE',
      });

      expect(res.status).toBe(500);
      const data = await res.json() as ErrorResponse;
      expect(data.message).toBe('Failed to delete task');
    });
  });
});
