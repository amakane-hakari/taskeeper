import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectTheme, setTheme } from '@/features/ui/uiSlice';

export const useTheme = () => {
  const theme = useSelector(selectTheme);
  const dispatch = useDispatch();

  useEffect(() => {
    // システムのカラーテーマ設定を監視
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const systemTheme = e.matches ? 'dark' : 'light';
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        dispatch(setTheme(systemTheme));
      }
    };

    // 初期設定
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      dispatch(setTheme(savedTheme as 'light' | 'dark'));
    } else {
      const systemTheme = mediaQuery.matches ? 'dark' : 'light';
      dispatch(setTheme(systemTheme));
    }

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [dispatch]);

  // テーマ変更時にlocalStorageに保存
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
  }, [dispatch, theme]);

  return {
    theme,
    toggleTheme,
    isDarkMode: theme === 'dark',
  };
};
