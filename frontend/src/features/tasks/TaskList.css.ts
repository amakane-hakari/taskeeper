import { style } from '@vanilla-extract/css';
import vars from '../../styles/theme.css';

export const createButton = style({
  padding: `${vars.space.small} ${vars.space.medium}`,
  backgroundColor: vars.colors.primary,
  color: '#ffffff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: vars.fontSizes.medium,
  marginBottom: vars.space.medium,
  ':hover': {
    filter: 'brightness(110%)',
  },
});

export const taskHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: vars.space.medium,
});

export const taskTitle = style({
  margin: 0,
  color: vars.colors.text,
});

export const taskMeta = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.small,
  color: vars.colors.secondary,
  fontSize: vars.fontSizes.small,
});

export const taskDescription = style({
  margin: `${vars.space.small} 0`,
  color: vars.colors.text,
});

export const loadingProgress = style({
  width: '100%',
  height: vars.space.medium,
});

export const errorMessage = style({
  color: '#ef4444',
  padding: vars.space.medium,
  border: '1px solid currentColor',
  borderRadius: '4px',
});
