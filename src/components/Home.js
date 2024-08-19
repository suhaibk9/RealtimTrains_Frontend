import React, { useEffect } from 'react';
import { Grid, Typography, Box, Divider, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPopularStations } from '../utils/inputSlice';
import { stations } from '../constants/stations';
import SearchTrains from './SearchTrains'; // Import the new SearchTrains component

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const popularStations = useSelector((state) => state.input.popularStations);

  useEffect(() => {
    dispatch(setPopularStations(stations.slice(0, 12)));
  }, [dispatch]);

  const handlePopularStationClick = (station) => {
    navigate(`/search/${station.crs}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-l from-blue-50 to-purple-50 p-10">
      <Grid
        container
        className="max-w-6xl mx-auto"
        justifyContent="space-between"
      >
        {/* Left Side - Welcome and Popular Stations */}
        <Grid item xs={12} md={7}>
          <Box textAlign="center" className="mb-16">
            <Typography
              variant="h2"
              className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700"
            >
              WELCOME
            </Typography>
            <Typography
              variant="body1"
              className="text-gray-700 mt-4"
              style={{
                fontSize: '1.25rem',
                fontWeight: '500',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              <strong>Train Radar</strong> provides real-time tracking of trains
              across the UK, offering detailed journey information, status
              updates, and route visualization on an interactive map.
            </Typography>
          </Box>

          <Divider
            sx={{ mb: 3 }}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
          />

          <Box>
            <Typography
              variant="h6"
              className="font-semibold text-gray-800"
              style={{
                textTransform: 'uppercase',
                marginBottom: '1.5rem',
                fontSize: '1.5rem',
                maxWidth: '600px',
                fontWeight: '500',
                letterSpacing: '0.05rem',
              }}
            >
              Popular Departure Boards
            </Typography>

            <Grid container spacing={2} className="mb-4">
              {popularStations.map((station) => (
                <Grid item xs={6} sm={4} key={station.crs}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="small"
                    className="text-white"
                    onClick={() => handlePopularStationClick(station)}
                    style={{
                      padding: '5px 10px',
                      fontSize: '0.875rem',
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
                </Grid>
              ))}
            </Grid>

            <Divider
              sx={{ mt: 3, mb: 4 }}
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
            />
          </Box>
        </Grid>

        {/* Right Side - Search Section */}
        <Grid item xs={12} md={5}>
          <SearchTrains /> {/* Use the new SearchTrains component here */}
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
