import { createGlobalTheme, createTheme, createThemeContract } from '@vanilla-extract/css';

const colors = {
  light: {
    background: '#ffffff',
    text: '#1a1a1a',
    primary: '#0066cc',
    secondary: '#4d4d4d',
    border: '#e0e0e0',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    background: '#1a1a1a',
    text: '#ffffff',
    primary: '#3399ff',
    secondary: '#b3b3b3',
    border: '#333333',
    shadow: 'rgba(255, 255, 255, 0.1)',
  },
};

const vars = createThemeContract({
  colors: {
    background: null,
    text: null,
    primary: null,
    secondary: null,
    border: null,
    shadow: null,
  },
  space: {
    small: null,
    medium: null,
    large: null,
  },
  fontSizes: {
    small: null,
    medium: null,
    large: null,
  },
});

export const baseTheme = createGlobalTheme(':root', {
  space: {
    small: '0.5rem',
    medium: '1rem',
    large: '2rem',
  },
  fontSizes: {
    small: '0.875rem',
    medium: '1rem',
    large: '1.25rem',
  },
});

export const lightTheme = createTheme(vars, {
  colors: colors.light,
  ...baseTheme,
});

export const darkTheme = createTheme(vars, {
  colors: colors.dark,
  ...baseTheme,
});

export default vars;
