import { FormattedMessage } from 'react-intl';
import { container, title } from './Dashboard.css.ts';

export const Dashboard = () => {
  return (
    <div className={container}>
      <h1 className={title}>
        <FormattedMessage id="app.header.dashboard" />
      </h1>
    </div>
  );
};
