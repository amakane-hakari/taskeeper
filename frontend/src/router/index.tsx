import { Route } from 'react-router-dom';
import { Dashboard } from '@/features/dashboard/Dashboard';
import Counter from '@/features/counter/Counter';
import { DefaultLayout } from '@/features/layouts/DefaultLayout';

export const routes = {
  home: '/',
  counter: '/counter-test',
} as const;

export const AppRoutes = (
  <>
    <Route element={<DefaultLayout />}>
      <Route path={routes.home} element={<Dashboard />} />
      <Route path={routes.counter} element={<Counter />} />
    </Route>
  </>
);
