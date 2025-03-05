import { Outlet } from 'react-router-dom';
import * as styles from './DefaultLayout.css';
import { Navigation } from '@/features/navigation/Navigation';
import { useNavCollapse } from '@/features/ui/hooks/useNavCollapse';
import { Header } from '@/features/header/Header';

export const DefaultLayout = () => {
  const { navCollapsed } = useNavCollapse();
  return (
    <div className={styles.layout}>
      <Header />
      <div className={navCollapsed ? styles.collapsedContainer : styles.container}>
        <Navigation />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
