import { style } from '@vanilla-extract/css';
import vars from '@/styles/theme.css';

export const nav = style({
  display: 'flex',
  flexDirection: 'row',
  borderRight: `1px solid ${vars.colors.border}`,
});

export const navList = style({
  listStyle: 'none',
  padding: 0,
  width: '100%',
});

export const navItem = style({
  padding: '1rem',
  fontSize: '1.2rem',
  maxHeight: '50px',
  overflow: 'hidden',
});

export const navHidden = style({
  display: 'none',
});

export const link = style({
  textDecoration: 'none',
  color: vars.colors.text,
  ':hover': {
    textDecoration: 'underline',
  },
});
