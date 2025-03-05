import React from 'react';
import * as styles from './ThemeToggle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle, className }) => {
  return (
    <button
      className={`${styles.button} ${className || ''}`}
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      data-theme={theme}
    >
      <FontAwesomeIcon
        className={styles.icon}
        icon={theme === 'light' ? faMoon : faSun}
        size="lg"
      />
    </button>
  );
};
