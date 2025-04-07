import { style } from '@vanilla-extract/css';
import vars from '../../styles/theme.css';

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.medium,
  padding: vars.space.large,
  backgroundColor: vars.colors.background,
  border: `1px solid ${vars.colors.border}`,
});

export const formGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.small,
});

export const label = style({
  color: vars.colors.text,
  fontSize: vars.fontSizes.small,
  fontWeight: 'bold',
});

export const input = style({
  padding: vars.space.small,
  border: `1px solid ${vars.colors.border}`,
  fontSize: vars.fontSizes.medium,
  color: vars.colors.text,
  backgroundColor: vars.colors.background,
  ':focus': {
    outline: 'none',
    borderColor: vars.colors.hoveredBorder,
    boxShadow: `0 0 0 2px ${vars.colors.hoveredShadow}`,
  }
});

export const textArea = style({
  padding: vars.space.small,
  border: `1px solid ${vars.colors.border}`,
  fontSize: vars.fontSizes.medium,
  color: vars.colors.text,
  backgroundColor: vars.colors.background,
  resize: 'vertical',
  minHeight: '100px',
  ':focus': {
    outline: 'none',
    borderColor: vars.colors.hoveredBorder,
    boxShadow: `0 0 0 2px ${vars.colors.hoveredShadow}`,
  }
});

export const submitButton = style({
  padding: `${vars.space.small} ${vars.space.medium}`,
  backgroundColor: vars.colors.primary,
  color: '#ffffff',
  border: 'none',
  fontSize: vars.fontSizes.medium,
  fontWeight: 'bold',
  cursor: 'pointer',
  ':hover': {
    filter: 'brightness(110%)',
  },
  ':disabled': {
    backgroundColor: vars.colors.secondary,
    cursor: 'not-allowed',
    opacity: 0.7,
  }
});

export const errorText = style({
  color: '#ef4444',
  fontSize: vars.fontSizes.small,
});
