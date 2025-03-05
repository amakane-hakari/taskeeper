import { style } from '@vanilla-extract/css';
import vars from '@/styles/theme.css';

export const button = style({
  background: 'transparent',
  border: `1px solid ${vars.colors.border}`,
  cursor: 'pointer',
  padding: vars.space.small,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: vars.fontSizes.medium,
  color: vars.colors.text,
  transition: 'all 0.3s ease',

  selectors: {
    '&:hover': {
      backgroundColor: vars.colors.secondary,
      color: vars.colors.background,
      transform: 'scale(1.1)',
    },

    '&:active': {
      transform: 'scale(0.95)',
    },
  },
});

export const icon = style({
  width: '20px',
  height: '20px',
  transition: 'transform 0.3s ease',
  selectors: {
    '[data-theme="dark"] &': {
      transform: 'rotate(360deg)',
    },
  },
});
