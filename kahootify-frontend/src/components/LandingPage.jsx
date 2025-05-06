import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role) {
      if (role === 'PLAYER') navigate('/waiting');
      else if (role === 'ADMIN') navigate('/admin/dashboard');
    }
  }, [navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#121212"
      color="white"
    >
      <Typography variant="h2" gutterBottom>
        Welcome to Kahootify!
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        An engaging quiz experience for classrooms and teams.
      </Typography>
      <Box mt={2}>
        <Button variant="contained" color="primary" component={Link} to="/login" sx={{ mr: 2 }}>
          Login
        </Button>
        <Button variant="contained" color="secondary" component={Link} to="/signup">
          Sign Up
        </Button>
      </Box>
    </Box>
  );
};

export default LandingPage;
