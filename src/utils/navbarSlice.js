import { createSlice } from '@reduxjs/toolkit';

const navbarSlice = createSlice({
  name: 'navbar_slice',
  initialState: {
    timeLoading: false,
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
    setTimeLoading: (state, action) => {
      state.timeLoading = action.payload;
    },
  },
});

export const {
  setTime,
  updateSeconds,
  resetTime,
  resetSeconds,
  setTimeLoading,
} = navbarSlice.actions;
export default navbarSlice.reducer;