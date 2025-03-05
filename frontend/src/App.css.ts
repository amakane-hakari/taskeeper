import { globalStyle, style } from '@vanilla-extract/css';
import vars from './styles/theme.css';

globalStyle('html, body', {
  margin: 0,
  padding: 0,
  fontFamily: 'Arial, sans-serif',
  backgroundColor: vars.colors.background,
  color: vars.colors.text,
  transition: 'background-color 0.3s ease, color 0.3s ease',
});

globalStyle('ul', {
  listStyle: 'none',
  padding: 0,
  margin: 0,
});

// リンクスタイル
export const link = style({
  color: vars.colors.primary,
  textDecoration: 'none',
  transition: 'color 0.3s ease',
});

globalStyle('a', {
  color: 'inherit',
});

// ボタンスタイル
export const button = style({
  border: `1px solid ${vars.colors.border}`,
  backgroundColor: vars.colors.background,
  color: vars.colors.text,
  padding: vars.space.small,
  borderRadius: '4px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  selectors: {
    '&:hover': {
      backgroundColor: vars.colors.primary,
      color: '#ffffff',
    },
  },
});

// 入力フィールドスタイル
export const input = style({
  backgroundColor: vars.colors.background,
  color: vars.colors.text,
  border: `1px solid ${vars.colors.border}`,
  padding: vars.space.small,
  borderRadius: '4px',
  transition: 'all 0.3s ease',
  selectors: {
    '&:focus': {
      outline: 'none',
      borderColor: vars.colors.primary,
    },
  },
});

globalStyle('input, textarea, select', {
  backgroundColor: vars.colors.background,
  color: vars.colors.text,
  border: `1px solid ${vars.colors.border}`,
  padding: vars.space.small,
  borderRadius: '4px',
  transition: 'all 0.3s ease',
});
