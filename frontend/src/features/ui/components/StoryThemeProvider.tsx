import React, { useState } from 'react';
import { lightTheme, darkTheme } from '@/styles/theme.css';

interface StoryThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: 'light' | 'dark';
}

export const StoryThemeProvider: React.FC<StoryThemeProviderProps> = ({ 
  children, 
  initialTheme = 'light' 
}) => {
  const [theme] = useState(initialTheme);
  const themeClass = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <div className={themeClass} data-theme={theme}>
      {children}
    </div>
  );
};
