import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  Alert
} from '@mui/material';
import quizApi from '../utils/quizApi';


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [error, setError] = useState('');

  // ✅ Check if user is admin before loading
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'ADMIN') {
      navigate('/unauthorized');
    }
  }, [navigate]);

  const fetchActiveQuiz = async () => {
    const token = localStorage.getItem('token'); // ✅ Fetch token from localStorage
  
    try {
      const res = await quizApi.get('/player/quiz/waitingoractive', {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (res.data.active) {
        setActiveQuiz(res.data);
      } else {
        setActiveQuiz(null);
      }
    } catch (err) {
      setError('Failed to fetch active quiz.');
    }
  };
  

  useEffect(() => {
    fetchActiveQuiz();
  }, []);

  const stopQuiz = async () => {
    try {
      await quizApi.post(`/admin/quiz/${activeQuiz.id}/stop`);
      fetchActiveQuiz();
    } catch (err) {
      setError('Failed to stop quiz.');
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">Current Active Quiz:</Typography>
        {activeQuiz ? (
          <>
            <Typography>Title: {activeQuiz.title}</Typography>
            <Typography>ID: {activeQuiz.id}</Typography>
            <Stack direction="row" spacing={2} mt={2}>
              <Button variant="contained" color="error" onClick={stopQuiz}>
                Stop Quiz
              </Button>
              <Button variant="outlined" onClick={() => navigate(`/admin/quiz/${activeQuiz.id}/results`)}>
                View Results
              </Button>
            </Stack>
          </>
        ) : (
          <Typography>No active quiz found.</Typography>
        )}
      </Paper>

      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={() => navigate('/admin/create-quiz')}>
          Create New Quiz
        </Button>
        <Button variant="outlined" onClick={() => navigate('/admin/questions')}>
          Manage Questions
        </Button>
      </Stack>
    </Box>
  );
};

export default AdminDashboard;
