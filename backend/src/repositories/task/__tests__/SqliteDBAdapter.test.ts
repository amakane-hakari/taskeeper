import { describe, it, expect } from 'vitest';
import { createSqliteDBAdapter } from '../SqliteDBAdapter';
import { Task, TaskStatus, TaskPriority } from '@/domains/task/types';

describe('SqliteDBAdapter', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    dueDate: new Date('2024-12-31'),
    status: 'not_started' as TaskStatus,
    priority: 'medium' as TaskPriority,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  it('タスクを作成して取得できること', async () => {
    const adapter = createSqliteDBAdapter();
    await adapter.insertTask(mockTask);
    
    const found = await adapter.findTaskById(mockTask.id);
    expect(found).toEqual(mockTask);
  });

  it('存在しないタスクの場合はnullを返すこと', async () => {
    const adapter = createSqliteDBAdapter();
    const found = await adapter.findTaskById('non-existent');
    expect(found).toBeNull();
  });

  it('タスクを更新できること', async () => {
    const adapter = createSqliteDBAdapter();
    await adapter.insertTask(mockTask);

    const update = {
      title: 'Updated Title',
      status: 'in_progress' as TaskStatus,
    };

    const updated = await adapter.updateTask(mockTask.id, update);
    expect(updated).not.toBeNull();
    expect(updated?.title).toBe(update.title);
    expect(updated?.status).toBe(update.status);
    expect(updated?.description).toBe(mockTask.description);
  });

  it('存在しないタスクの更新時はnullを返すこと', async () => {
    const adapter = createSqliteDBAdapter();
    const update = { title: 'Updated Title' };
    
    const updated = await adapter.updateTask('non-existent', update);
    expect(updated).toBeNull();
  });

  it('タスクを削除できること', async () => {
    const adapter = createSqliteDBAdapter();
    await adapter.insertTask(mockTask);
    
    await adapter.removeTask(mockTask.id);
    const found = await adapter.findTaskById(mockTask.id);
    expect(found).toBeNull();
  });

  it('全てのタスクを一覧で取得できること', async () => {
    const adapter = createSqliteDBAdapter();
    const mockTask2 = { ...mockTask, id: '2' };
    
    await adapter.insertTask(mockTask);
    await adapter.insertTask(mockTask2);
    
    const tasks = await adapter.listTasks();
    expect(tasks).toHaveLength(2);
    expect(tasks).toEqual(expect.arrayContaining([mockTask, mockTask2]));
  });

  it('日付の変換が正しく処理されること', async () => {
    const adapter = createSqliteDBAdapter();
    await adapter.insertTask(mockTask);
    
    const found = await adapter.findTaskById(mockTask.id);
    expect(found?.dueDate).toBeInstanceOf(Date);
    expect(found?.createdAt).toBeInstanceOf(Date);
    expect(found?.updatedAt).toBeInstanceOf(Date);
    expect(found?.dueDate.toISOString()).toBe(mockTask.dueDate.toISOString());
  });
});
