import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { increment, decrement, incrementAsync, decrementAsync } from './counterSlice';
import { FormattedMessage } from 'react-intl';
import { AVAILABLE_LOCALES } from '../../i18n/config';
import { selectLocale, setLocale } from '../ui/uiSlice';

const Counter = () => {
  const dispatch = useDispatch();
  const { value, loading } = useSelector((state: RootState) => state.counter);
  const currentLocale = useSelector(selectLocale);

  return (
    <div>
      <h2>
        <FormattedMessage id="counter.value" values={{ value }} />
      </h2>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button onClick={() => dispatch(increment())} disabled={loading}>
          <FormattedMessage id="counter.button.increment" />
        </button>
        <button onClick={() => dispatch(decrement())} disabled={loading}>
          <FormattedMessage id="counter.button.decrement" />
        </button>
      </div>
      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button onClick={() => dispatch(incrementAsync())} disabled={loading}>
          <FormattedMessage id="counter.button.incrementAsync" />
        </button>
        <button onClick={() => dispatch(decrementAsync())} disabled={loading}>
          <FormattedMessage id="counter.button.incrementAsync" />
        </button>
      </div>
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default Counter;
