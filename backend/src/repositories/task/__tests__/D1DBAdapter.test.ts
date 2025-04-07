import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { createD1DBAdapter } from '../D1DBAdapter';
import { Task } from '@/domains/task/types';
import { Miniflare } from 'miniflare';
import { D1Database } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/d1';
import { sql } from 'drizzle-orm';
import { tasks } from '@/schema';

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

    // Drizzleを使用してテーブルを作成
    const drizzleDb = drizzle(db);
    await drizzleDb.run(sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        due_date TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
        priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);
  });

  afterAll(async () => {
    const drizzleDb = drizzle(db);
    await drizzleDb.run(sql`DROP TABLE IF EXISTS tasks`);
  });

  beforeEach(async () => {
    // 各テスト前にテーブルをクリーンアップ
    const drizzleDb = drizzle(db);
    await drizzleDb.delete(tasks);
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
    it('タスクを正常に登録できること', async () => {
      const adapter = createD1DBAdapter(db);
      const task = createTestTask('test-insert');

      await adapter.insertTask(task);
      const result = await adapter.findTaskById('test-insert');
      expect(result).toEqual(task);
    });

    it('説明文がundefinedの場合も登録できること', async () => {
      const adapter = createD1DBAdapter(db);
      const task = createTestTask('test-insert-undefined-desc');
      task.description = undefined;

      await adapter.insertTask(task);
      const result = await adapter.findTaskById('test-insert-undefined-desc');
      expect(result).toEqual(task);
    });
  });

  describe('findTaskById', () => {
    it('存在しないタスクの場合はnullを返すこと', async () => {
      const adapter = createD1DBAdapter(db);
      const result = await adapter.findTaskById('non-existent');
      expect(result).toBeNull();
    });

    it('既存のタスクを取得できること', async () => {
      const adapter = createD1DBAdapter(db);
      const task = createTestTask('test-find');

      await adapter.insertTask(task);
      const result = await adapter.findTaskById('test-find');
      expect(result).toEqual(task);
    });

    it('空の説明文はundefinedに変換されること', async () => {
      const adapter = createD1DBAdapter(db);
      const task = createTestTask('test-find-empty-desc');
      task.description = undefined;

      await adapter.insertTask(task);
      const result = await adapter.findTaskById('test-find-empty-desc');
      expect(result?.description).toBeUndefined();
    });
  });

  describe('updateTask', () => {
    it('既存のタスクを更新できること', async () => {
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
      // 他のフィールドは変更されていないことを確認
      expect(result?.description).toBe(task.description);
    });

    it('説明文をundefinedに更新できること', async () => {
      const adapter = createD1DBAdapter(db);
      const task = createTestTask('test-update-desc');

      await adapter.insertTask(task);
      const update = {
        description: undefined,
      };

      const result = await adapter.updateTask('test-update-desc', update);
      expect(result?.description).toBeUndefined();
    });

    it('存在しないタスクの更新時はnullを返すこと', async () => {
      const adapter = createD1DBAdapter(db);
      const result = await adapter.updateTask('non-existent', { title: 'New Title' });
      expect(result).toBeNull();
    });
  });

  describe('removeTask', () => {
    it('既存のタスクを削除できること', async () => {
      const adapter = createD1DBAdapter(db);
      const task = createTestTask('test-remove');

      await adapter.insertTask(task);
      await adapter.removeTask('test-remove');
      const result = await adapter.findTaskById('test-remove');
      expect(result).toBeNull();
    });
  });

  describe('listTasks', () => {
    it('全てのタスクを一覧で取得できること', async () => {
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

    it('説明文が空のタスクも一覧で取得できること', async () => {
      const adapter = createD1DBAdapter(db);
      const task1 = createTestTask('test-list-desc-1');
      const task2 = createTestTask('test-list-desc-2');
      task2.description = undefined;

      await Promise.all([
        adapter.insertTask(task1),
        adapter.insertTask(task2)
      ]);

      const results = await adapter.listTasks();
      expect(results).toHaveLength(2);
      const task2Result = results.find(t => t.id === 'test-list-desc-2');
      expect(task2Result?.description).toBeUndefined();
    });
  });
});
