import vars from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const card = style({
  padding: '1rem',
  width: '100%',
  boxShadow: `0 0 10px ${vars.colors.shadow}`,
  border: `1px solid ${vars.colors.border}`,
  borderRadius: '3px',
  backgroundColor: vars.colors.background,
  color: vars.colors.text,
  transition: 'box-shadow 0.2s',
  ':hover': {
    boxShadow: `0 0 10px ${vars.colors.hoveredShadow}`,
  },
});

export const header = style({
  paddingBottom: '1rem',
  borderBottom: `1px solid ${vars.colors.border}`,
})

export const title = style({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: vars.colors.text,
  margin: '0',
});

export const subtitle = style({
  color: vars.colors.text,
  margin: '0',
});

export const content = style({
  paddingTop: '1rem',
});