import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  token: null,
  steps: 0,
  notifiedLogros: [],
  expoPushToken: null,
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
    addNotifiedLogro(state, action) {
      if (!state.notifiedLogros.includes(action.payload)) {
        state.notifiedLogros.push(action.payload);
      }
    },
    setNotifiedLogros(state, action) {
      state.notifiedLogros = action.payload;
    },
    setExpoPushToken(state, action) {
      state.expoPushToken = action.payload;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.notifiedLogros = [];
    },
  },
});

export const { setUser, setToken, logout, addSteps, setSteps, addNotifiedLogro, setNotifiedLogros, setExpoPushToken } = userSlice.actions;
export default userSlice.reducer;
