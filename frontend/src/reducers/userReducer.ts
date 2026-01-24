import { createSlice } from '@reduxjs/toolkit';
import { LOGIN_USER, FETCH_USER, UPDATE_USER, FETCH_ALL_USERS } from '../actions/userActions';
import type { User } from '../interfaces';

interface UserState {
  currentUser: User | null;
  viewedUser: User | null;
  allUsers: User[];
}

const initialState: UserState = {
  currentUser: null,
  viewedUser: null,
  allUsers: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      localStorage.removeItem('crosstalk_user');
    },
    restoreUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(LOGIN_USER.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        localStorage.setItem('crosstalk_user', JSON.stringify(action.payload));
      })
      .addCase(FETCH_USER.fulfilled, (state, action) => {
        state.viewedUser = action.payload;
      })
      .addCase(UPDATE_USER.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        localStorage.setItem('crosstalk_user', JSON.stringify(action.payload));
      })
      .addCase(FETCH_ALL_USERS.fulfilled, (state, action) => {
        state.allUsers = action.payload;
      });
  },
});

export const { logout, restoreUser } = userSlice.actions;
export default userSlice.reducer;
