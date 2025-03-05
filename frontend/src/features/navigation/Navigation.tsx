import { Link } from 'react-router-dom';
import { routes } from '@/router';
import * as styles from './Navigation.css';
import { useNavCollapse } from '@/features/ui/hooks/useNavCollapse';
import { NavCollapsedToggle } from '@/components/settings/NavCollapsedToggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGauge, faStopwatch20, IconDefinition } from '@fortawesome/free-solid-svg-icons';

export const Navigation = () => {
  const { navCollapsed, toggleNavCollapsed } = useNavCollapse();

  const NavHider = ({ icon, text }: { icon: IconDefinition; text: string }) => {
    return (
      <>
        <FontAwesomeIcon icon={icon} />
        <span className={navCollapsed ? styles.navHidden : ''}>&nbsp;{text}</span>
      </>
    );
  };

  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        <li>
          <NavCollapsedToggle navCollapsed={navCollapsed} toggleNavCollapsed={toggleNavCollapsed} />
        </li>
        <li className={styles.navItem}>
          <Link className={styles.link} to={routes.home}>
            <NavHider icon={faGauge} text="ホーム" />
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link className={styles.link} to={routes.counter}>
            <NavHider icon={faStopwatch20} text="カウンター" />
          </Link>
        </li>
      </ul>
    </nav>
  );
};
