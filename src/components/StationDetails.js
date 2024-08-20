import React, { useEffect } from 'react';
import { Box, Typography, Grid, Paper, Container } from '@mui/material';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import TrainLoader from '../customComponents/TrainLoader';
import { stations } from '../constants/stations';
import {
  setTrainData,
  setLoading,
  setStationName,
  setTimeLoaded,
  setFirstRender,
} from '../utils/stationSlice';
import {
  setSelectedStation,
  setInputValue,
  setOpen,
} from '../utils/inputSlice';
import { setTime } from '../utils/navbarSlice';
import SearchTrains from './SearchTrains'; // Import the SearchTrains component
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the toastify CSS

const StationDetails = () => {
  const { stationCode } = useParams();
  const dispatch = useDispatch();
  const trainData = useSelector((state) => state.station.trainData);
  const loading = useSelector((state) => state.station.loading);
  const stationName = useSelector((state) => state.station.stationName);
  const firstLoad = useSelector((state) => state.station.firstRender);
  useEffect(() => {
    const station = stations.find((st) => st.crs === stationCode);
    const stationName = station ? station.name : 'Unknown Station';
    dispatch(setStationName(stationName));
  }, [stationCode, dispatch]);

  const fetchTrainData = () => {
    if (stationCode) {
      dispatch(setLoading(true));
      axios
        .get(`https://realtimtrains-backend.onrender.com/search/${stationCode}`)
        .then((response) => {
          dispatch(setTrainData(response.data.services));
          dispatch(setLoading(false));
          dispatch(setSelectedStation(null));
          dispatch(setTimeLoaded(new Date()));
          dispatch(setTime(new Date().toISOString())); // Set the timer to 60 seconds
        })
        .catch((error) => {
          console.error('Error fetching train data:', error);
          dispatch(setLoading(false));
        });
    }
  };

  const fetchTrainDataSuccessive = () => {
    if (stationCode) {
      dispatch(setLoading(true));
      axios
        .get(`https://realtimtrains-backend.onrender.com/search/${stationCode}`)
        .then((response) => {
          dispatch(setTrainData(response.data.services));
          dispatch(setLoading(false));
          dispatch(setSelectedStation(null));
          dispatch(setTimeLoaded(new Date()));
          dispatch(setTime(new Date().toISOString())); // Set the timer to 60 seconds
          toast.success('Trains Updated');
        })
        .catch((error) => {
          console.error('Error fetching train data:', error);
          dispatch(setLoading(false));
        });
    }
  };

  useEffect(() => {
    fetchTrainData(); // Initial data fetch
    if (firstLoad) dispatch(setFirstRender(false));
    const intervalId = setInterval(fetchTrainDataSuccessive, 60000); // Fetch data every minute

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [stationCode, dispatch]);

  const renderTrainBox = (service) => {
    const { gbttBookedDeparture, realtimeDeparture, platform, displayAs } =
      service.locationDetail;
    const { atocName, serviceUid } = service;
    const isCancelled = displayAs === 'CANCELLED_CALL';
    const platformInfo = isCancelled
      ? 'Cancelled'
      : `Platform ${platform || 'TBD'}`;
    const expectedTime = realtimeDeparture
      ? `Expected at ${realtimeDeparture}`
      : '';

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    return (
      <Link
        to={`/service/${serviceUid}/${year}/${month}/${day}`}
        key={serviceUid}
        style={{ textDecoration: 'none' }}
      >
        <Paper
          elevation={3}
          sx={{
            borderRadius: '4px',
            padding: '8px',
            marginBottom: '8px',
            backgroundColor: isCancelled ? '#FFCCCC' : '#E3F2FD',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: isCancelled ? '#FFB3B3' : '#BBDEFB',
            },
          }}
        >
          <Grid container alignItems="center">
            <Grid item xs={2}>
              <Typography variant="h6" sx={{ textAlign: 'center' }}>
                {gbttBookedDeparture}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6">
                to {service.locationDetail.destination[0].description}
              </Typography>
              <Typography variant="body2">{expectedTime}</Typography>
              <Typography variant="body2" color="textSecondary">
                {atocName} service
              </Typography>
            </Grid>
            <Grid item xs={4} textAlign="right">
              <Typography variant="h6">{platformInfo}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Link>
    );
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: 'flex',
        gap: 2,
        marginTop: '24px', // Added margin to pull content down from the navbar
      }}
    >
      <ToastContainer /> {/* Add ToastContainer to render toasts */}
      <Box
        sx={{
          flex: 1,
          padding: '24px',
          background: 'linear-gradient(to left, #ebf8ff, #f3e5f5)',
          borderRadius: '8px',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: '16px',
            marginBottom: '16px',
            textAlign: 'center',
            background: 'linear-gradient(to right, #ffffff, #f7f7f7)',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Trains Departing from {stationName}
          </Typography>
        </Paper>

        {loading ? (
          <TrainLoader />
        ) : trainData.length > 0 ? (
          <Box>{trainData.map((service) => renderTrainBox(service))}</Box>
        ) : (
          <Typography>No train data available</Typography>
        )}
      </Box>
      <Box sx={{ flex: 1, maxWidth: '400px' }}>
        <SearchTrains /> {/* Use the SearchTrains component here */}
      </Box>
    </Container>
  );
};

export default StationDetails;
