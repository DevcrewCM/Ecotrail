import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import imageReducer from './slices/imageSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    images: imageReducer
  },
});

export default store;
