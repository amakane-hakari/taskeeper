import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Locale, defaultLocale } from '../../i18n/config';

type Theme = 'light' | 'dark';

interface UiState {
  navCollapsed: boolean;
  locale: Locale;
  theme: Theme;
}

const initialState: UiState = {
  navCollapsed: false,
  locale: defaultLocale,
  theme: 'light',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleNavCollapsed: (state) => {
      state.navCollapsed = !state.navCollapsed;
    },
    setLocale: (state, action: PayloadAction<Locale>) => {
      state.locale = action.payload;
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
  },
});

export const { toggleNavCollapsed, setLocale, setTheme } = uiSlice.actions;

export const selectLocale = (state: { ui: UiState }) => state.ui.locale;
export const selectTheme = (state: { ui: UiState }) => state.ui.theme;
