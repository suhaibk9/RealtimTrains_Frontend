import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ErrorComponent = ({
  message = 'An error occurred. Please try again later.',
}) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <>
      <Navbar /> {/* Include the Navbar at the top */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 64px)', // Adjust height to account for the Navbar
          background: 'linear-gradient(to left, #ebf8ff, #f3e5f5)',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: '24px 32px',
            textAlign: 'center',
            background: 'linear-gradient(to right, #ffffff, #f7f7f7)',
            borderRadius: '8px',
            maxWidth: '400px',
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 'bold', marginBottom: '16px' }}
          >
            Oops!
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#333', marginBottom: '24px' }}
          >
            {message}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGoHome}
            sx={{
              backgroundColor: '#2f80ed',
              '&:hover': {
                backgroundColor: '#1c5db5',
              },
            }}
          >
            Go To Home
          </Button>
        </Paper>
      </Box>
    </>
  );
};

export default ErrorComponent;
