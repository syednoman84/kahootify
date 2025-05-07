import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Paper
} from '@mui/material';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WaitingScreen = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const wsBaseUrl = process.env.REACT_APP_QUIZ_SERVICE_URL.replace(/\/$/, '') + '/ws';

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(wsBaseUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      onConnect: () => {
        client.subscribe('/topic/quiz-status', (message) => {
          const data = JSON.parse(message.body);
          if (data.status === 'QUIZ_STARTED') {
            navigate(`/quiz/${data.quizId}`);
          }
        });
      },
      onStompError: (frame) => {
        console.error('STOMP Error:', frame.headers['message']);
      }
    });

    client.activate();
    return () => client.deactivate();
  }, [navigate, token]);

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
