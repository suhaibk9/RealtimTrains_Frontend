// src/utils/detailSlice.js
import { createSlice } from '@reduxjs/toolkit';

const detailSlice = createSlice({
  name: 'detail_slice',
  initialState: {
    serviceData: null,
    locationsCoords: [],
  },
  reducers: {
    setServiceData(state, action) {
      state.serviceData = action.payload;
    },
    setLocationsCoords(state, action) {
      state.locationsCoords = action.payload;
    },
  },
});

export const { setServiceData, setLocationsCoords } = detailSlice.actions;

export default detailSlice.reducer;
