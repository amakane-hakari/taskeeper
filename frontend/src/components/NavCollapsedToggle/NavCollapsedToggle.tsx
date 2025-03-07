import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesRight, faAnglesLeft } from '@fortawesome/free-solid-svg-icons';
import * as styles from './NavCollapsedToggle.css';

export interface NavCollapsedToggleProps {
  navCollapsed: boolean;
  toggleNavCollapsed: () => void;
}

export const NavCollapsedToggle: React.FC<NavCollapsedToggleProps> = ({
  navCollapsed,
  toggleNavCollapsed,
}) => {
  return (
    <div className={styles.collapseButton}>
      <a onClick={toggleNavCollapsed}>
        <FontAwesomeIcon icon={navCollapsed ? faAnglesRight : faAnglesLeft} />
      </a>
    </div>
  );
};
