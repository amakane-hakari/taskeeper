import { all } from 'redux-saga/effects';
import { watchCounterSaga } from '@/features/counter/counterSaga';

export default function* rootSaga() {
  yield all([watchCounterSaga()]);
}
