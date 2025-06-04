import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskCreate } from '../TaskCreate';
import tasksReducer from '../tasksSlice';
import { uiSlice } from '../../ui/uiSlice';
import { counterSlice } from '../../counter/counterSlice';
import { ThemeProvider } from '../../ui/components/ThemeProvider';

// fetchをモック化
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('TaskCreate', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  const createMockStore = () => configureStore({
    reducer: {
      tasks: tasksReducer,
      ui: uiSlice.reducer,
      counter: counterSlice.reducer,
    },
  });

  const renderWithProviders = (component: React.ReactElement) => {
    const store = createMockStore();
    return {
      store,
      ...render(
        <Provider store={store}>
          <ThemeProvider>{component}</ThemeProvider>
        </Provider>
      )
    };
  };

  it('タスク作成フォームが正しくレンダリングされること', () => {
    renderWithProviders(<TaskCreate />);
    
    expect(screen.getByLabelText('タイトル')).toBeInTheDocument();
    expect(screen.getByLabelText('説明')).toBeInTheDocument();
    expect(screen.getByLabelText('期限')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '作成' })).toBeInTheDocument();
  });

  it('バリデーションエラーが正しく表示されること', async () => {
    renderWithProviders(<TaskCreate />);
    
    const submitButton = screen.getByRole('button', { name: '作成' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('タイトルは必須です')).toBeInTheDocument();
    });
  });

  it('フォーム送信時に正しくタスクが作成されること', async () => {
    // fetchモックの設定
    const mockTask = {
      id: '1',
      title: 'テストタスク',
      description: 'テスト説明',
      dueDate: '2025-12-31',
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTask),
    });

    const { store } = renderWithProviders(<TaskCreate />);
    
    fireEvent.change(screen.getByLabelText('タイトル'), {
      target: { value: 'テストタスク' },
    });
    fireEvent.change(screen.getByLabelText('説明'), {
      target: { value: 'テスト説明' },
    });
    fireEvent.change(screen.getByLabelText('期限'), {
      target: { value: '2025-12-31' },
    });

    const submitButton = screen.getByRole('button', { name: '作成' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.tasks.tasks).toContainEqual(
        expect.objectContaining({
          title: 'テストタスク',
          description: 'テスト説明',
          dueDate: '2025-12-31',
        })
      );
    });
  });
});
