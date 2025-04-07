import { Route } from 'react-router-dom';
import { Dashboard } from '@/features/dashboard/Dashboard';
import Counter from '@/features/counter/Counter';
import { DefaultLayout } from '@/features/layouts/DefaultLayout';
import { TaskList } from '@/features/tasks/TaskList';
import { TaskCreate } from '@/features/tasks/TaskCreate';
import { routes } from './constants';

export const AppRoutes = (
  <>
    <Route element={<DefaultLayout />}>
      <Route path={routes.home} element={<Dashboard />} />
      <Route path={routes.taskList} element={<TaskList />} />
      <Route path={routes.taskCreate} element={<TaskCreate />} />
      <Route path={routes.counter} element={<Counter />} />
    </Route>
  </>
);
