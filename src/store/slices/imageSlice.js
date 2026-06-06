import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const imageSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    addImage(state, action){
        state[Object.keys(state).length] = action.payload
    },
    /*
    retrieveImages(state, action){
        
    }*/
  },
});

export const { addImage, retrieveImages } = imageSlice.actions;
export default imageSlice.reducer;
