import { createAsyncThunk } from '@reduxjs/toolkit';
import { topicsApi } from '../sources/api';
import type { Topic, TopicWithQuestions, TopicProgress } from '../interfaces';

export const FETCH_TOPICS = createAsyncThunk<Topic[], void>(
  'topics/FETCH_TOPICS',
  async () => {
    return topicsApi.list();
  }
);

export const FETCH_TOPIC_QUESTIONS = createAsyncThunk<TopicWithQuestions, number>(
  'topics/FETCH_TOPIC_QUESTIONS',
  async (topicId) => {
    return topicsApi.getWithQuestions(topicId);
  }
);

export const FETCH_TOPIC_PROGRESS = createAsyncThunk<
  TopicProgress,
  { topicId: number; userId: number }
>('topics/FETCH_TOPIC_PROGRESS', async ({ topicId, userId }) => {
  return topicsApi.getProgress(topicId, userId);
});
