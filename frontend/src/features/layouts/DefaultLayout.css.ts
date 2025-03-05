import { style } from '@vanilla-extract/css';
import vars from '@/styles/theme.css';

export const layout = style({
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
  minHeight: '100vh',
  backgroundColor: vars.colors.background,
});

export const container = style({
  display: 'grid',
  gridTemplateColumns: '200px 1fr',
  transition: 'grid-template-columns 0.3s ease',
  backgroundColor: vars.colors.background,
});

export const collapsedContainer = style([
  container,
  {
    gridTemplateColumns: '50px 1fr',
  },
]);

export const main = style({
  padding: '2rem',
  backgroundColor: vars.colors.background,
  color: vars.colors.text,
});
