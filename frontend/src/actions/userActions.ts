import { createAsyncThunk } from '@reduxjs/toolkit';
import { usersApi } from '../sources/api';
import type { User } from '../interfaces';

export const LOGIN_USER = createAsyncThunk<
  User,
  { username: string; displayName?: string; blogUrl?: string }
>('user/LOGIN_USER', async ({ username, displayName, blogUrl }) => {
  return usersApi.createOrLogin(username, displayName, blogUrl);
});

export const FETCH_USER = createAsyncThunk<User, string>(
  'user/FETCH_USER',
  async (username) => {
    return usersApi.getByUsername(username);
  }
);

export const UPDATE_USER = createAsyncThunk<
  User,
  { username: string; displayName?: string; blogUrl?: string }
>('user/UPDATE_USER', async ({ username, displayName, blogUrl }) => {
  return usersApi.update(username, {
    display_name: displayName,
    blog_url: blogUrl,
  });
});

export const FETCH_ALL_USERS = createAsyncThunk<User[], void>(
  'user/FETCH_ALL_USERS',
  async () => {
    return usersApi.list();
  }
);
