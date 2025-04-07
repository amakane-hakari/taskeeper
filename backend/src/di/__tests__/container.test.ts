import { describe, it, expect, vi } from 'vitest';
import { createDIMiddleware } from '../container';
import { createD1DBAdapter } from '@/repositories/task/D1DBAdapter';
import { createTaskRepository } from '@/repositories/task';
import { Context } from 'hono';

// D1DBAdapter のモック
vi.mock('@/repositories/task/D1DBAdapter', () => ({
  createD1DBAdapter: vi.fn().mockReturnValue({
    type: 'mocked-d1-adapter'
  })
}));

// TaskRepository のモック
vi.mock('@/repositories/task', () => ({
  createTaskRepository: vi.fn().mockReturnValue({
    type: 'mocked-task-repository'
  })
}));

describe('DIコンテナ', () => {
  it('依存関係が正しく注入されること', async () => {
    // モックの Context を作成
    const mockDB = { type: 'mocked-d1-database' };
    const mockContext = {
      env: { DB: mockDB, ENV: 'test' },
      set: vi.fn(),
    } as unknown as Context;
    const next = vi.fn();

    // DIミドルウェアを作成して実行
    const middleware = createDIMiddleware();
    await middleware(mockContext, next);

    // D1DBAdapterが正しく作成されたか検証
    expect(createD1DBAdapter).toHaveBeenCalledWith(mockDB);

    // TaskRepositoryが正しく作成されたか検証
    expect(createTaskRepository).toHaveBeenCalledWith({
      type: 'mocked-d1-adapter'
    });

    // 依存関係が正しく注入されたか検証
    expect(mockContext.set).toHaveBeenCalledWith(
      'taskRepository',
      { type: 'mocked-task-repository' }
    );

    // nextミドルウェアが呼び出されたか検証
    expect(next).toHaveBeenCalled();
  });
});
