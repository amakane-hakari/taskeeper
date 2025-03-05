import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesRight, faAnglesLeft } from '@fortawesome/free-solid-svg-icons';
import * as styles from './NavCollapsedToggle.css';

interface NavCollapsedToggleProp {
  navCollapsed: boolean;
  toggleNavCollapsed: () => void;
}

export const NavCollapsedToggle: React.FC<NavCollapsedToggleProp> = ({
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
