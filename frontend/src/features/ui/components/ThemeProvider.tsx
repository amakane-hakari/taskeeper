import React from 'react';
import { useTheme } from '@/features/ui/hooks/useTheme';
import { lightTheme, darkTheme } from '@/styles/theme.css';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  const themeClass = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <div className={themeClass} data-theme={theme}>
      {children}
    </div>
  );
};
