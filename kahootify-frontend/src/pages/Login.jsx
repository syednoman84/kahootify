import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, TextField, Button, Typography, Paper, Box, Alert
} from '@mui/material';
import userApi from '../utils/userApi';
import { jwtDecode } from 'jwt-decode';


const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
  
    if (token && role) {
      if (role === 'PLAYER') navigate('/waiting');
      else if (role === 'ADMIN') navigate('/admin/dashboard');
    }
  }, [navigate]);
  
  

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await userApi.post('/auth/login', form);
      const { token } = response.data;
  
      const decoded = jwtDecode(token);
      console.log('Decoded JWT:', decoded);

      const role = decoded.role;
      const username = decoded.sub || decoded.username; // adjust if needed
  
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', username);
  
      // Redirect based on role
      if (role === 'PLAYER') navigate('/waiting');
      else if (role === 'ADMIN') navigate('/admin/dashboard');
  
      console.log("Login successful, navigating to:", role === 'ADMIN' ? '/admin/dashboard' : '/waiting');
    } catch (err) {
      console.error(err);
      setError('Invalid username or password');
    }
  };
  



  return (
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ padding: 4, mt: 10 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              name="username"
              label="Username"
              variant="outlined"
              fullWidth
              value={form.username}
              onChange={handleChange}
            />
            <TextField
              name="password"
              type="password"
              label="Password"
              variant="outlined"
              fullWidth
              value={form.password}
              onChange={handleChange}
            />
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </Box>
        </form>

      </Paper>
    </Container>
  );
};

export default Login;
