import { Link } from 'react-router-dom';
import { routes } from '@/router/constants';
import * as styles from './Navigation.css';
import { useNavCollapse } from '@/features/ui/hooks/useNavCollapse';
import { NavCollapsedToggle } from '@/components/NavCollapsedToggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGauge, faListCheck, faStopwatch20, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FormattedMessage } from 'react-intl';
import { ReactNode } from 'react';

export const Navigation: React.FC = () => {
  const { navCollapsed, toggleNavCollapsed } = useNavCollapse();

  const NavHider = ({ icon, children }: { icon: IconDefinition; children: ReactNode }) => {
    return (
      <>
        <FontAwesomeIcon icon={icon} />
        <span className={navCollapsed ? styles.navHidden : ''}>{children}</span>
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
            <NavHider icon={faGauge}>
              <FormattedMessage id="navigation.dashboard" />
            </NavHider>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link className={styles.link} to={routes.taskList}>
            <NavHider icon={faListCheck}>
              <FormattedMessage id="navigation.taskList" />
            </NavHider>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link className={styles.link} to={routes.counter}>
            <NavHider icon={faStopwatch20}>カウンター</NavHider>
          </Link>
        </li>
      </ul>
    </nav>
  );
};
