import { createSlice } from '@reduxjs/toolkit';

const mapSlice = createSlice({
  name: 'map',
  initialState: {
    coordinatesMap: {
      'London Euston': { lat: 51.528306, lon: -0.133389 },
      'Manchester Piccadilly': { lat: 53.47739, lon: -2.230255 },
      'Birmingham New Street': { lat: 52.477778, lon: -1.898333 },
      "Leeds": { lat: 53.795984, lon: -1.54864 },
      'Glasgow Central': { lat: 55.859377, lon: -4.257602 },
      'Edinburgh Waverley': { lat: 55.95238, lon: -3.189527 },
      'Liverpool Lime Street': { lat: 53.407457, lon: -2.977936 },
      'Bristol Temple Meads': { lat: 51.449074, lon: -2.581621 },
      "Nottingham": { lat: 52.94718, lon: -1.14698 },
      "Reading": { lat: 51.458235, lon: -0.971367 },
      'Cardiff Central': { lat: 51.476865, lon: -3.179111 },
      "Sheffield": { lat: 53.378057, lon: -1.462832 },
      Newcastle: { lat: 54.9689, lon: -1.617439 },
      York: { lat: 53.958, lon: -1.093 },
      Brighton: { lat: 50.82838, lon: -0.141 },
      'Southampton Central': { lat: 50.907389, lon: -1.414131 },
      'Milton Keynes Central': { lat: 52.0346, lon: -0.774936 },
      Cambridge: { lat: 52.194, lon: 0.1378 },
      Oxford: { lat: 51.75439, lon: -1.2681 },
    },
  },
  reducers: {
    setCoordinates(state, action) {
      const { locationName, lat, lon } = action.payload;
      state.coordinatesMap[locationName] = { lat, lon };
    },
  },
});

export const { setCoordinates } = mapSlice.actions;
export default mapSlice.reducer;
