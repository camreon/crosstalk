import { createSlice } from '@reduxjs/toolkit';
import { FETCH_USER_RESPONSES, FETCH_TOPIC_RESPONSES, SAVE_RESPONSES } from '../actions/responseActions';
import type { ResponseWithQuestion } from '../interfaces';

interface ResponsesState {
  userResponses: ResponseWithQuestion[];
  topicResponses: ResponseWithQuestion[];
  lastSaveCount: number;
}

const initialState: ResponsesState = {
  userResponses: [],
  topicResponses: [],
  lastSaveCount: 0,
};

const responsesSlice = createSlice({
  name: 'responses',
  initialState,
  reducers: {
    clearTopicResponses: (state) => {
      state.topicResponses = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(FETCH_USER_RESPONSES.fulfilled, (state, action) => {
        state.userResponses = action.payload;
      })
      .addCase(FETCH_TOPIC_RESPONSES.fulfilled, (state, action) => {
        state.topicResponses = action.payload;
      })
      .addCase(SAVE_RESPONSES.fulfilled, (state, action) => {
        state.lastSaveCount = action.payload.count;
      });
  },
});

export const { clearTopicResponses } = responsesSlice.actions;
export default responsesSlice.reducer;
