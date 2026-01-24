import { createAsyncThunk } from '@reduxjs/toolkit';
import { compareApi } from '../sources/api';
import type { CompareResult } from '../interfaces';

export const COMPARE_USERS = createAsyncThunk<
  CompareResult,
  { user1Id: number; user2Id: number }
>('compare/COMPARE_USERS', async ({ user1Id, user2Id }) => {
  return compareApi.compare(user1Id, user2Id);
});
