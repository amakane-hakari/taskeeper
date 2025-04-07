import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, vi } from 'vitest';
import { TaskCreate } from '../TaskCreate';
import tasksSlice from '../tasksSlice';
import { ThemeProvider } from '../../ui/components/ThemeProvider';

describe('TaskCreate', () => {
  const mockStore = configureStore({
    reducer: {
      tasks: tasksSlice.reducer,
    },
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <Provider store={mockStore}>
        <ThemeProvider>{component}</ThemeProvider>
      </Provider>
    );
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
    renderWithProviders(<TaskCreate />);
    
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
      const state = mockStore.getState();
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
