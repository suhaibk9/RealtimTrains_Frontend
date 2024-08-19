import { createSlice } from '@reduxjs/toolkit';
const inputSlice = createSlice({
  name: 'input_slice',
  initialState: {
    selectedStation: null,
    inputValue: '',
    open: false,
    recentlySelected: [],
    popularStations: [],
  },
  reducers: {
    setSelectedStation: (state, action) => {
      state.selectedStation = action.payload;
    },
    setInputValue: (state, action) => {
      state.inputValue = action.payload;
      state.open = action.payload ? true : false;
    },
    setOpen: (state, action) => {
      state.open = action.payload;
    },
    setRecentlySelected: (state, action) => {
      if (state.recentlySelected.length < 5) {
        state.recentlySelected.push(action.payload);
      } else {
        state.recentlySelected.shift();
        state.recentlySelected.push(action.payload);
      }
    },
    setPopularStations: (state, action) => {
      state.popularStations = action.payload;
    },
  },
});
export const {
  setSelectedStation,
  setInputValue,
  setOpen,
  setPopularStations,
    setRecentlySelected,
} = inputSlice.actions;
export default inputSlice.reducer;
