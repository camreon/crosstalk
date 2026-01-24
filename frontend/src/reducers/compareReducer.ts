import { createSlice } from '@reduxjs/toolkit';
import { COMPARE_USERS } from '../actions/compareActions';
import type { CompareResult } from '../interfaces';

interface CompareState {
  result: CompareResult | null;
}

const initialState: CompareState = {
  result: null,
};

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    clearCompareResult: (state) => {
      state.result = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(COMPARE_USERS.fulfilled, (state, action) => {
      state.result = action.payload;
    });
  },
});

export const { clearCompareResult } = compareSlice.actions;
export default compareSlice.reducer;
