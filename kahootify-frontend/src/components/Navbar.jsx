// src/components/Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';


const Navbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center" gap={3}>
          <Typography
            variant="h4"
            component={Link}
            to="/"
            sx={{
              fontFamily: '"Pacifico", cursive',
              textDecoration: 'none',
              color: '#ffffff',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Kahootify
          </Typography>

          {role === 'ADMIN' && (
            <>
              <Button color="inherit" onClick={() => navigate('/admin/dashboard')}>
                Dashboard
              </Button>
              <Button color="inherit" onClick={() => navigate('/admin/create-quiz')}>
                Create Quiz
              </Button>
              <Button color="inherit" onClick={() => navigate('/admin/questions')}>
                Manage Questions
              </Button>
            </>
          )}
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          {username && <Typography>{username}</Typography>}
          {username && (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
