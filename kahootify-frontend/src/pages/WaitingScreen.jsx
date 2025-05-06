import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Paper
} from '@mui/material';
import quizApi from '../utils/quizApi';

const WaitingScreen = () => {
  const [quizActive, setQuizActive] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await quizApi.get('/player/quiz/waitingoractive'); 
        if (res.data.active) {
          setQuizActive(true);
          setQuizTitle(res.data.title);
          navigate(`/quiz/${res.data.id}`);
        }
      } catch (err) {
        console.error('Error polling for active quiz:', err);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <Box height="100vh" display="flex" justifyContent="center" alignItems="center" bgcolor="#1a202c">
      <Paper elevation={6} sx={{ padding: 4, textAlign: 'center', backgroundColor: '#2d3748', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Waiting for Quiz to Start...
        </Typography>
        <Typography variant="h6" gutterBottom>
          Stay tuned! You will be redirected once the quiz begins.
        </Typography>
        <CircularProgress color="inherit" />
      </Paper>
    </Box>
  );
};

export default WaitingScreen;
