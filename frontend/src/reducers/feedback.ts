import { createSlice, isAnyOf, isPending, isRejected } from '@reduxjs/toolkit';
import { LOGIN_USER, FETCH_USER, UPDATE_USER, FETCH_ALL_USERS } from '../actions/userActions';
import { FETCH_TOPICS, FETCH_TOPIC_QUESTIONS, FETCH_TOPIC_PROGRESS } from '../actions/topicActions';
import { SAVE_RESPONSES, FETCH_USER_RESPONSES, FETCH_TOPIC_RESPONSES } from '../actions/responseActions';
import { COMPARE_USERS } from '../actions/compareActions';

interface FeedbackState {
  loading: boolean;
  error: string | null;
}

const initialState: FeedbackState = {
  loading: false,
  error: null,
};

const allActions = [
  LOGIN_USER,
  FETCH_USER,
  UPDATE_USER,
  FETCH_ALL_USERS,
  FETCH_TOPICS,
  FETCH_TOPIC_QUESTIONS,
  FETCH_TOPIC_PROGRESS,
  SAVE_RESPONSES,
  FETCH_USER_RESPONSES,
  FETCH_TOPIC_RESPONSES,
  COMPARE_USERS,
];

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(...allActions.map((a) => isPending(a))),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(...allActions.map((a) => a.fulfilled)),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        isAnyOf(...allActions.map((a) => isRejected(a))),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'An error occurred';
        }
      );
  },
});

export const { clearError } = feedbackSlice.actions;
export default feedbackSlice.reducer;
