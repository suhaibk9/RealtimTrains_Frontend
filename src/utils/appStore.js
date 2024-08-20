import { configureStore } from '@reduxjs/toolkit';
import stationReducer from './stationSlice';
import inputReducer from './inputSlice';
import navbarReducer from './navbarSlice';
import mapReducer from './mapSlice';
import detailReducer from './detailsSlice';
const appStore = configureStore({
  reducer: {
    input: inputReducer,
    station: stationReducer,
    navbar: navbarReducer,
    map: mapReducer,
    details: detailReducer
  },
});
export default appStore;
