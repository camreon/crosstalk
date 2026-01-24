import { createAsyncThunk } from '@reduxjs/toolkit';
import { responsesApi } from '../sources/api';
import type { ResponseWithQuestion, SaveResponseInput } from '../interfaces';

export const SAVE_RESPONSES = createAsyncThunk<
  { success: boolean; count: number },
  SaveResponseInput[]
>('responses/SAVE_RESPONSES', async (responses) => {
  return responsesApi.save(responses);
});

export const FETCH_USER_RESPONSES = createAsyncThunk<ResponseWithQuestion[], number>(
  'responses/FETCH_USER_RESPONSES',
  async (userId) => {
    return responsesApi.getByUser(userId);
  }
);

export const FETCH_TOPIC_RESPONSES = createAsyncThunk<
  ResponseWithQuestion[],
  { userId: number; topicId: number }
>('responses/FETCH_TOPIC_RESPONSES', async ({ userId, topicId }) => {
  return responsesApi.getByUserAndTopic(userId, topicId);
});
