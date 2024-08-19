import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Container,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import TrainLoader from '../customComponents/TrainLoader';
import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  Polyline,
} from 'react-leaflet';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useDispatch, useSelector } from 'react-redux';
import { setCoordinates } from '../utils/mapSlice';
import { setTime } from '../utils/navbarSlice';
import stationData from '../constants/station_coords.json';
import 'leaflet-arrowheads';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the toastify CSS

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const ServiceDetails = () => {
  const { serviceUid, year, month, day } = useParams();
  const [serviceData, setServiceData] = useState(null);
  const [locationsCoords, setLocationsCoords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const coordinatesMap = useSelector((state) => state.map.coordinatesMap);

  const fetchServiceData = async () => {
    try {
      const response = await axios.get(
        `https://realtimtrains-backend.onrender.com/service/${serviceUid}/${year}/${month}/${day}`
      );
      setServiceData(response.data);
      dispatch(setTime(new Date().toISOString())); // Set the timer to 60 seconds
    } catch (error) {
      console.error('Error fetching service data:', error);
      setError('Failed to fetch service data.');
    } finally {
      setLoading(false);
    }
  };
  const fetchServiceDataSuccessive = async () => {
    try {
      const response = await axios.get(
        `https://realtimtrains-backend.onrender.com/service/${serviceUid}/${year}/${month}/${day}`
      );
      setServiceData(response.data);
      dispatch(setTime(new Date().toISOString())); // Set the timer to 60 seconds
      toast.success('Services Updated'); // Show toast notification
    } catch (error) {
      console.error('Error fetching service data:', error);
      setError('Failed to fetch service data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceData(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchServiceDataSuccessive(); // Fetch every 60 seconds
    }, 60000);

    return () => clearInterval(intervalId); // Cleanup on component unmount

    // serviceUid, year, month, day
  }, []);

  const fetchCoordinatesWithRetry = async (location, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${location.description}`,
          { timeout: 10000 }
        );
        if (response.data.length > 0) {
          const { lat, lon } = response.data[0];
          dispatch(
            setCoordinates({ locationName: location.description, lat, lon })
          );
          return { lat, lon, name: location.description };
        }
        return null;
      } catch (error) {
        if (i < retries - 1) {
          console.warn(`Retrying (${i + 1}/${retries})...`);
          continue;
        } else {
          console.error('Error fetching coordinates:', error);
          return null;
        }
      }
    }
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    if (serviceData) {
      const fetchCoordinates = async () => {
        const coords = [];
        let originCoord = null;
        let destinationCoord = null;

        for (let location of serviceData.locations) {
          let coord = stationData.find(
            (station) =>
              station.stationName.toLowerCase() ===
              location.description.toLowerCase()
          );

          if (coord) {
            coord = {
              lat: coord.lat,
              lon: coord.long,
              name: location.description,
            };
          } else if (coordinatesMap[location.description]) {
            coord = {
              ...coordinatesMap[location.description],
              name: location.description,
            };
          } else {
            coord = await fetchCoordinatesWithRetry(location);
          }

          if (location.displayAs === 'ORIGIN') {
            originCoord = coord;
          } else if (location.displayAs === 'DESTINATION') {
            destinationCoord = coord;
          } else if (coord) {
            coords.push(coord);
          }

          await delay(500);
        }

        if (originCoord) coords.unshift(originCoord);
        if (destinationCoord) coords.push(destinationCoord);

        setLocationsCoords(coords);
      };

      fetchCoordinates();
    }
  }, [serviceData, coordinatesMap, dispatch]);

  const getLocationStatus = (serviceLocation) => {
    switch (serviceLocation) {
      case 'APPR_STAT':
        return 'Approaching Station';
      case 'APPR_PLAT':
        return 'Arriving';
      case 'AT_PLAT':
        return 'At Platform';
      case 'DEP_PREP':
        return 'Preparing to Depart';
      case 'DEP_READY':
        return 'Ready to Depart';
      default:
        return '';
    }
  };

  const renderLocationRow = (location) => {
    const {
      crs,
      description,
      platform,
      gbttBookedArrival,
      gbttBookedDeparture,
      realtimeArrival,
      realtimeDeparture,
      realtimeGbttArrivalLateness,
      realtimeGbttDepartureLateness,
      displayAs,
      serviceLocation,
    } = location;

    const statusText =
      displayAs === 'ORIGIN' || displayAs === 'DESTINATION'
        ? displayAs
        : getLocationStatus(serviceLocation);

    const delayText =
      realtimeGbttArrivalLateness || realtimeGbttDepartureLateness
        ? `+${Math.max(
            realtimeGbttArrivalLateness || 0,
            realtimeGbttDepartureLateness || 0
          )}`
        : '';

    return (
      <Grid
        container
        key={crs}
        sx={{ padding: '8px 0', borderBottom: '1px solid #ddd' }}
        alignItems="center"
      >
        <Grid item xs={1}>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            {crs}
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" sx={{ marginRight: '16px' }}>
              {description}
            </Typography>
            {statusText && (
              <Box
                sx={{
                  backgroundColor: '#f0f0f0',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  display: 'inline-block',
                }}
              >
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ fontStyle: 'italic' }}
                >
                  {statusText}
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
        <Grid item xs={1}>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            {platform ? `Platform ${platform}` : 'TBD'}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            {gbttBookedArrival || '-'}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            {gbttBookedDeparture || '-'}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            {realtimeArrival || '-'}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            {realtimeDeparture || '-'}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography
            variant="body2"
            sx={{ textAlign: 'center', color: 'error.main' }}
          >
            {delayText}
          </Typography>
        </Grid>
      </Grid>
    );
  };

  if (loading) {
    return <TrainLoader />;
  }

  if (error) {
    return <Typography>{error}</Typography>;
  }

  if (!serviceData) {
    return <Typography>No service data available.</Typography>;
  }

  const { trainIdentity, origin, destination, locations } = serviceData;

  return (
    <Box
      sx={{
        background: 'linear-gradient(to left, #ebf8ff, #f3e5f5)',
        padding: '40px',
      }}
    >
      <ToastContainer /> {/* Add ToastContainer to render toasts */}
      <Container maxWidth="lg">
        <Paper
          elevation={3}
          sx={{
            padding: '24px',
            marginBottom: '24px',
            textAlign: 'center',
            background: 'linear-gradient(to right, #ffffff, #f7f7f7)',
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 'bold', marginBottom: '12px' }}
          >
            {trainIdentity} - {origin[0].description} to{' '}
            {destination[0].description}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Departing {year}-{month}-{day}
          </Typography>
        </Paper>

        <Paper
          elevation={3}
          sx={{
            padding: '16px',
            marginBottom: '24px',
            background: 'linear-gradient(to right, #ffffff, #f7f7f7)',
          }}
        >
          <Grid
            container
            sx={{
              padding: '8px 16px',
              backgroundColor: '#f5f5f5',
              fontWeight: 'bold',
            }}
            alignItems="center"
          >
            <Grid item xs={1}>
              <Typography variant="body2" sx={{ textAlign: 'center' }}>
                CRS
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <Typography variant="body2" sx={{ textAlign: 'left' }}>
                Location
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="body2" sx={{ textAlign: 'center' }}>
                Platform
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="body2" sx={{ textAlign: 'center' }}>
                Planned Arr
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="body2" sx={{ textAlign: 'center' }}>
                Planned Dep
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="body2" sx={{ textAlign: 'center' }}>
                Real Arr
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="body2" sx={{ textAlign: 'center' }}>
                Real Dep
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="body2" sx={{ textAlign: 'center' }}>
                Delay
              </Typography>
            </Grid>
          </Grid>
          {locations.map((location) => renderLocationRow(location))}
        </Paper>

        <Paper
          elevation={3}
          sx={{
            padding: '16px',
            background: 'linear-gradient(to right, #ffffff, #f7f7f7)',
          }}
        >
          <Typography
            variant="h5"
            sx={{ marginBottom: '16px', textAlign: 'center' }}
          >
            Route Map
          </Typography>
          <Box sx={{ width: '100%', height: '500px', position: 'relative' }}>
            {locationsCoords.length > 0 && locationsCoords[0]?.lat ? (
              <MapContainer
                center={[locationsCoords[0].lat, locationsCoords[0].lon]}
                zoom={10}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Polyline
                  positions={locationsCoords.map((coord) => [
                    coord.lat,
                    coord.lon,
                  ])}
                  color="blue"
                  weight={4}
                  opacity={0.6}
                  arrowheads={{ frequency: '200m', size: '15px' }}
                />
                {locationsCoords.map(
                  (coord, index) =>
                    coord.lat && (
                      <Marker key={index} position={[coord.lat, coord.lon]}>
                        <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                          {`${index + 1}. ${coord.name}`}
                        </Tooltip>
                      </Marker>
                    )
                )}
              </MapContainer>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <CircularProgress />
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ServiceDetails;
