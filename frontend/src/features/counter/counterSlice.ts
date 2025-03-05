import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
  loading: boolean;
}

const initialState: CounterState = {
  value: 0,
  loading: false,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    incrementAsync: (state) => {
      state.loading = true;
    },
    decrementAsync: (state) => {
      state.loading = true;
    },
  },
});

export const { increment, decrement, setLoading, incrementAsync, decrementAsync } =
  counterSlice.actions;

export default counterSlice.reducer;
