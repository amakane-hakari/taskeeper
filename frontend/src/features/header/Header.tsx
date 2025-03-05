import { ThemeToggle } from '@/components/settings/ThemeToggle';
import { AVAILABLE_LOCALES } from '@/i18n/config';
import React from 'react';
import { selectLocale, setLocale } from '@/features/ui/uiSlice';
import * as styles from './Header.css';
import { useTheme } from '@/features/ui/hooks/useTheme';
import { useSelector, useDispatch } from 'react-redux';

export const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const currentLocale = useSelector(selectLocale);

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <div className={styles.logo}>
          <img className={styles.logoImage} src="logo.svg" />
          Taskeeper
        </div>
      </div>
      <div className={styles.rightNav}>
        <ThemeToggle
          theme={theme}
          onToggle={toggleTheme}
          className={isDarkMode ? 'dark' : 'light'}
        />
        <div>
          <ul>
            {AVAILABLE_LOCALES.map((locale) => (
              <a
                key={locale}
                className={currentLocale === locale ? styles.currentLocale : styles.locale}
                onClick={() => dispatch(setLocale(locale))}
              >
                {locale.toUpperCase()}
              </a>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};
