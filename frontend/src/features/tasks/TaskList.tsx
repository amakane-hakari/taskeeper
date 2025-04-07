import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../store';
import { fetchTasks, type Task } from './tasksSlice';
import { Card, CardList } from '../../components/Card';
import { routes } from '../../router/constants';
import * as styles from './TaskList.css';

export function TaskList() {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, status, error } = useSelector((state: RootState) => state.tasks);
  const intl = useIntl();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTasks());
    }
  }, [dispatch, status]);

  if (status === 'loading') {
    return <progress className={styles.loadingProgress}>{intl.formatMessage({ id: 'taskList.loading' })}</progress>;
  }

  if (status === 'failed' && error) {
    return <div role="alert" className={styles.errorMessage}>{intl.formatMessage({ id: 'taskList.error' })}</div>;
  }

  return (
    <div>
      <div className={styles.taskHeader}>
        <h2>{intl.formatMessage({ id: 'taskList.title' })}</h2>
        <Link to={routes.taskCreate}>
          <button className={styles.createButton}>{intl.formatMessage({ id: 'taskList.createNew' })}</button>
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div>{intl.formatMessage({ id: 'taskList.empty' })}</div>
      ) : (
        <CardList>
          {tasks.map((task: Task) => (
            <Card key={task.id}>
              <div role="listitem">
                <h3 className={styles.taskTitle}>{task.title}</h3>
                {task.description && (
                  <p className={styles.taskDescription}>{task.description}</p>
                )}
                <div className={styles.taskMeta}>
                  {task.dueDate && (
                    <span>
                      {intl.formatMessage(
                        { id: 'taskList.dueDate' },
                        { date: new Date(task.dueDate).toLocaleDateString() }
                      )}
                    </span>
                  )}
                  <span>
                    {intl.formatMessage(
                      { id: 'taskList.createdAt' },
                      { date: new Date(task.createdAt).toLocaleDateString() }
                    )}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </CardList>
      )}
    </div>
  );
}
