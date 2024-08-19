import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  trainData: [],
  loading: true,
  stationName: '',
  timeLoaded: null,
  firstRender: true,
};

const stationSlice = createSlice({
  name: 'station',
  initialState,
  reducers: {
    setTrainData: (state, action) => {
      state.trainData = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setStationName: (state, action) => {
      state.stationName = action.payload;
    },
    setTimeLoaded: (state, action) => {
      state.timeLoaded = action.payload;
    },
    setFirstRender: (state, action) => {
      state.firstRender = action.payload;
    },
  },
});

export const {
  setTrainData,
  setLoading,
  setStationName,
  setTimeLoaded,
  setFirstRender,
} = stationSlice.actions;

export default stationSlice.reducer;
