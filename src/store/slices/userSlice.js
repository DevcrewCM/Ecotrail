import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  token: null,
  steps: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    addSteps(state, action) {
      state.steps += action.payload;
    },
    setSteps(state, action) {
      state.steps = action.payload;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
    },
  },
});

export const { setUser, setToken, logout, addSteps, setSteps } = userSlice.actions;
export default userSlice.reducer;
