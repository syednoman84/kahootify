import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, TextField, Button, Typography, Paper, Box, Alert, MenuItem
} from '@mui/material';
import userApi from '../utils/userApi';

const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'PLAYER',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userApi.post('/auth/signup', form);
      setSuccess('Signup successful! You can now login.');
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error(err);
      setError('Signup failed. Try a different username.');
      setSuccess('');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ padding: 4, mt: 10 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
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
          <TextField
            name="role"
            label="Role"
            select
            value={form.role}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="PLAYER">Player</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" color="primary">
            Sign Up
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignUp;
