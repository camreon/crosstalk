import { createSlice } from '@reduxjs/toolkit';
import { FETCH_TOPICS, FETCH_TOPIC_QUESTIONS, FETCH_TOPIC_PROGRESS } from '../actions/topicActions';
import type { Topic, TopicWithQuestions, TopicProgress } from '../interfaces';

interface TopicsState {
  topics: Topic[];
  currentTopic: TopicWithQuestions | null;
  progress: Record<number, TopicProgress>;
}

const initialState: TopicsState = {
  topics: [],
  currentTopic: null,
  progress: {},
};

const topicsSlice = createSlice({
  name: 'topics',
  initialState,
  reducers: {
    clearCurrentTopic: (state) => {
      state.currentTopic = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(FETCH_TOPICS.fulfilled, (state, action) => {
        state.topics = action.payload;
      })
      .addCase(FETCH_TOPIC_QUESTIONS.fulfilled, (state, action) => {
        state.currentTopic = action.payload;
      })
      .addCase(FETCH_TOPIC_PROGRESS.fulfilled, (state, action) => {
        state.progress[action.payload.topic_id] = action.payload;
      });
  },
});

export const { clearCurrentTopic } = topicsSlice.actions;
export default topicsSlice.reducer;
