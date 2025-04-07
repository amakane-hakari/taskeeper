import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import { TaskList } from '../TaskList';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer, { Task } from '../tasksSlice';
import { IntlProvider } from 'react-intl';
import jaMessages from '@/i18n/locales/ja.json';

const mockTasks: Task[] = [
  { id: '1', title: 'タスク1', completed: false, createdAt: '2025-03-28T12:00:00Z' },
  { id: '2', title: 'タスク2', completed: true, createdAt: '2025-03-28T13:00:00Z' }
];

describe('TaskList', () => {
  beforeEach(() => {
    // フェッチのグローバルモックをリセット
    vi.restoreAllMocks();
  });

  it('タスク一覧を表示できる', async () => {
    // フェッチのモック
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockTasks
    } as Response);

    const store = configureStore({
      reducer: {
        tasks: tasksReducer,
      },
    });

    render(
      <IntlProvider messages={jaMessages} locale="ja">
        <Provider store={store}>
          <TaskList />
        </Provider>
      </IntlProvider>
    );

    // データ取得中のローディング状態を確認
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // タスク一覧の取得完了後、データが表示されることを確認
    const taskItems = await screen.findAllByRole('listitem');
    expect(taskItems).toHaveLength(2);
    expect(screen.getByText('タスク1')).toBeInTheDocument();
    expect(screen.getByText('タスク2')).toBeInTheDocument();
  });
});
