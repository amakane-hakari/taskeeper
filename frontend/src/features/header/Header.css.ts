import { style } from '@vanilla-extract/css';
import vars from '@/styles/theme.css';

export const header = style({
  display: 'flex',
  backgroundColor: vars.colors.background,
  borderBottom: `1px solid ${vars.colors.border}`,
});

export const logoContainer = style({
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem 0.5rem',
  width: '200px',
  color: vars.colors.text,
  fontSize: '1.5rem',
  textAlign: 'center',
  overflow: 'hidden',
});

export const logo = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.colors.text,
  border: '1px solid',
  borderColor: vars.colors.primary,
  borderRadius: '1.5rem',
  fontSize: '1.5rem',
  fontFamily: '"Cooper Black", serif',
  textAlign: 'center',
  overflow: 'hidden',
});

export const logoImage = style({
  height: '1.5rem',
  marginRight: '0.5rem',
});

export const rightNav = style({
  alignItems: 'center',
  flexGrow: '2',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  padding: '1rem',
});

export const locale = style({
  color: vars.colors.text,
  cursor: 'pointer',
  padding: '0.5rem',
  textDecoration: 'underline',
});

export const currentLocale = style([locale, {
  fontWeight: 'bold',
  textDecoration: 'none',
}]);