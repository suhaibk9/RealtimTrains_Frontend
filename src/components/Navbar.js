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

  const pathArr = location.pathname.split('/');
  console.log('pathArr:', pathArr);
  let dataName = '';
  if (pathArr[1] === 'search')
    dataName = 'Train Data will be updated in ' + seconds + ' seconds';
  else if (pathArr[1] === 'service')
    dataName = 'Service Data will be updated in ' + seconds + ' seconds';
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
            Train Radar
          </Link>
        </Typography>
        {location.pathname !== '/' &&
          (pathArr[1] === 'search' || pathArr[1] === 'service') && (
            <Box>
              <Typography variant="body1">{dataName}</Typography>
            </Box>
          )}
      </Toolbar>
    </AppBar>
  );
};
{
}
export default Navbar;
