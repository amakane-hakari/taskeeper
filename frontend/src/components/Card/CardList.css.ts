import vars from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const cardList = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '16px',
  width: '100%',
  padding: '16px',
  margin: '0',
  backgroundColor: vars.colors.background,
});