import { takeLatest, put, delay } from 'redux-saga/effects';
import { increment, decrement, setLoading, incrementAsync, decrementAsync } from './counterSlice';

function* handleIncrementAsync() {
  try {
    yield delay(1000);
    yield put(increment());
  } finally {
    yield put(setLoading(false));
  }
}

function* handleDecrementAsync() {
  try {
    yield delay(1000);
    yield put(decrement());
  } finally {
    yield put(setLoading(false));
  }
}

export function* watchCounterSaga() {
  yield takeLatest(incrementAsync.type, handleIncrementAsync);
  yield takeLatest(decrementAsync.type, handleDecrementAsync);
}
