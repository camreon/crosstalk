import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userReducer';
import topicsReducer from './topicsReducer';
import responsesReducer from './responsesReducer';
import compareReducer from './compareReducer';
import feedbackReducer from './feedback';

export const store = configureStore({
  reducer: {
    user: userReducer,
    topics: topicsReducer,
    responses: responsesReducer,
    compare: compareReducer,
    feedback: feedbackReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
