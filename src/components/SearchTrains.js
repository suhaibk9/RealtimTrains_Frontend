import React from 'react';
import {
  TextField,
  Button,
  Autocomplete,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setTimeLoading } from '../utils/navbarSlice';
import {
  setSelectedStation,
  setInputValue,
  setOpen,
  setRecentlySelected,
} from '../utils/inputSlice';
import { stations } from '../constants/stations';
import { setFirstRender } from '../utils/stationSlice';
const SearchTrains = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedStation = useSelector((state) => state.input.selectedStation);
  const inputValue = useSelector((state) => state.input.inputValue);
  const open = useSelector((state) => state.input.open);
  const recentlySelected = useSelector((state) => state.input.recentlySelected);

  const handleStationSelect = (event, newValue) => {
    dispatch(setSelectedStation(newValue));
  };

  const handleInputChange = (event, newInputValue) => {
    dispatch(setInputValue(newInputValue));
  };

  const handleSearchClick = () => {
    dispatch(setTimeLoading(true));
    if (selectedStation) {
      dispatch(setRecentlySelected(selectedStation));
      dispatch(setFirstRender(true));
      navigate(`/search/${selectedStation.crs}`);
    }
  };

  const handleRecentStationClick = (station) => {
    dispatch(setTimeLoading(true));
    dispatch(setFirstRender(true));
    dispatch(setSelectedStation(station));
    navigate(`/search/${station.crs}`);
  };

  return (
    <Box display="flex" justifyContent="center">
      <Paper
        elevation={3}
        className="p-6 bg-gradient-to-r from-white to-gray-100 rounded-lg shadow-md"
        style={{ width: '100%', maxWidth: '400px' }}
      >
        <Typography
          variant="h6"
          className="font-semibold text-gray-800"
          sx={{ mb: 6 }}
          style={{
            fontSize: '1.5rem',
            fontWeight: '500',
            textAlign: 'center',
            letterSpacing: '0.05rem',
          }}
        >
          Search for Trains
        </Typography>
        <Autocomplete
          options={stations}
          getOptionLabel={(option) => `${option.name}`}
          className="w-full mb-4"
          onChange={handleStationSelect}
          onInputChange={handleInputChange}
          inputValue={inputValue}
          open={open}
          onOpen={() => {
            if (inputValue) {
              dispatch(setOpen(true));
            }
          }}
          onClose={() => dispatch(setOpen(false))}
          disableOpenOnFocus
          renderOption={(props, option) => (
            <li
              {...props}
              className="flex justify-between"
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                backgroundColor: 'white',
                transition: 'background-color 0.2s ease-in-out',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <span>{option.name}</span>
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Station"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: null,
              }}
              className="bg-white rounded-lg"
            />
          )}
        />

        {/* Recently Selected Buttons */}
        <Box display="flex" flexWrap="wrap" gap={1} className="mb-4">
          {recentlySelected.map((station, index) => (
            <Button
              key={index}
              variant="contained"
              size="small"
              className="text-white"
              onClick={() => handleRecentStationClick(station)}
              style={{
                padding: '4px 8px',
                fontSize: '0.75rem',
                textTransform: 'none',
                background: 'linear-gradient(to-r, #6366F1, #8B5CF6)',
                color: '#fff',
                borderColor: 'transparent',
                transition: 'background 0.3s',
              }}
              onMouseOver={(e) => {
                e.target.style.background =
                  'linear-gradient(to-r, #4F46E5, #7C3AED)';
              }}
              onMouseOut={(e) => {
                e.target.style.background =
                  'linear-gradient(to-r, #6366F1, #8B5CF6)';
              }}
            >
              {station.name}
            </Button>
          ))}
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSearchClick}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded-lg"
        >
          Search
        </Button>
      </Paper>
    </Box>
  );
};

export default SearchTrains;
