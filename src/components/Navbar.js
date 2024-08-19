import React, { useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import {
  resetTime,
  updateSeconds,
  setTime,
  resetSeconds,
} from '../utils/navbarSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const seconds = useSelector((state) => state.navbar.seconds);
  const timeLoaded = useSelector((state) => state.navbar.timeLoaded);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      dispatch(resetTime()); // Reset time when navigating to the home page
    } else {
      if (!timeLoaded) {
        dispatch(setTime(new Date().toISOString())); // Set initial time when first loaded
      }
      dispatch(resetSeconds()); // Reset the countdown to 60 seconds on every new data load
      const intervalId = setInterval(() => {
        dispatch(updateSeconds()); // Update the countdown every second
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [location.pathname, timeLoaded, dispatch]);

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            Realtime Trains
          </Link>
        </Typography>
        {location.pathname !== '/' && (
          <Box>
            <Typography variant="body1">
              Data updates in {seconds} seconds
            </Typography>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
