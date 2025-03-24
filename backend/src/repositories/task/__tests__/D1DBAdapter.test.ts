import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { createD1DBAdapter } from '../D1DBAdapter';
import { Task } from '@/domains/task/types';
import { Miniflare } from 'miniflare';
import { D1Database } from '@cloudflare/workers-types';

describe('D1DBAdapter', () => {
  let miniflare: Miniflare;
  let db: D1Database;

  beforeAll(async () => {
    // Miniflareインスタンスの作成
    miniflare = new Miniflare({
      modules: true,
      d1Databases: ["DB"],
      script: `
        export default {
          async fetch(request, env) {
            return new Response("OK");
          }
        }
      `,
    });

    // D1データベースの取得
    db = await miniflare.getD1Database("DB");

    // テーブルの作成
    await db.exec('CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL, dueDate TEXT NOT NULL, status TEXT NOT NULL DEFAULT \'not_started\' CHECK (status IN (\'not_started\', \'in_progress\', \'completed\')), priority TEXT NOT NULL DEFAULT \'medium\' CHECK (priority IN (\'low\', \'medium\', \'high\')), createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL)');
  });

  afterAll(async () => {
    await db.exec('DROP TABLE IF EXISTS tasks');
  });

  beforeEach(async () => {
    // 各テスト前にテーブルをクリーンアップ
    await db.exec('DELETE FROM tasks');
  });

  const createTestTask = (id: string): Task => ({
    id,
    title: 'Test Task',
    description: 'Test Description',
    dueDate: new Date('2024-12-31'),
    status: 'not_started',
    priority: 'medium',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  });

  describe('insertTask', () => {
    it('should insert a task', async () => {
      const adapter = createD1DBAdapter(db);
      const task = createTestTask('test-insert');

      await adapter.insertTask(task);
      const result = await adapter.findTaskById('test-insert');
      expect(result).toEqual(task);
    });
  });

  describe('findTaskById', () => {
    it('should return null for non-existent task', async () => {
      const adapter = createD1DBAdapter(db);
      const result = await adapter.findTaskById('non-existent');
      expect(result).toBeNull();
    });

    it('should find an existing task', async () => {
      const adapter = createD1DBAdapter(db);
      const task = createTestTask('test-find');

      await adapter.insertTask(task);
      const result = await adapter.findTaskById('test-find');
      expect(result).toEqual(task);
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      const adapter = createD1DBAdapter(db);
      const task = createTestTask('test-update');

      await adapter.insertTask(task);
      const update = {
        title: 'Updated Title',
        status: 'in_progress' as const,
      };

      const result = await adapter.updateTask('test-update', update);
      expect(result).toBeTruthy();
      expect(result?.title).toBe('Updated Title');
      expect(result?.status).toBe('in_progress');
    });

    it('should return null for non-existent task', async () => {
      const adapter = createD1DBAdapter(db);
      const result = await adapter.updateTask('non-existent', { title: 'New Title' });
      expect(result).toBeNull();
    });
  });

  describe('removeTask', () => {
    it('should remove an existing task', async () => {
      const adapter = createD1DBAdapter(db);
      const task = createTestTask('test-remove');

      await adapter.insertTask(task);
      await adapter.removeTask('test-remove');
      const result = await adapter.findTaskById('test-remove');
      expect(result).toBeNull();
    });
  });

  describe('listTasks', () => {
    it('should list all tasks', async () => {
      const adapter = createD1DBAdapter(db);
      const tasks = [
        createTestTask('test-list-1'),
        createTestTask('test-list-2'),
      ];

      await Promise.all(tasks.map(task => adapter.insertTask(task)));
      const result = await adapter.listTasks();
      expect(result).toHaveLength(2);
      expect(result).toEqual(expect.arrayContaining(tasks));
    });
  });
});
