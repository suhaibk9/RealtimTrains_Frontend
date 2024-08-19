import { createSlice } from '@reduxjs/toolkit';

const navbarSlice = createSlice({
  name: 'navbar_slice',
  initialState: {
    timeLoaded: null,
    seconds: 60,
  },
  reducers: {
    setTime: (state, action) => {
      state.timeLoaded = action.payload;
      state.seconds = 60;
    },
    updateSeconds: (state) => {
      if (state.seconds > 0) {
        state.seconds -= 1;
      }
    },
    resetTime: (state) => {
      state.timeLoaded = null;
      state.seconds = 60;
    },
    resetSeconds: (state) => {
      state.seconds = 60;
    },
  },
});

export const { setTime, updateSeconds, resetTime, resetSeconds } =
  navbarSlice.actions;
export default navbarSlice.reducer;
