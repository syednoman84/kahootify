import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  Button,
  CircularProgress,
  Stack,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getToken } from '../utils/auth';
import quizApi from '../utils/quizApi';


const QuizSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = getToken();
  const navigate = useNavigate();
  const { quizId } = useParams(); // optional if you're passing quizId via route

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await quizApi.get(`/player/quiz/${quizId}/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSummary(res.data);
      } catch (err) {
        alert('Unable to fetch quiz summary');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    if (quizId) fetchSummary();
  }, [token, quizId]);
  

  if (loading) {
    return (
      <Box p={10} textAlign="center">
        <CircularProgress />
        <Typography mt={2}>Loading summary...</Typography>
      </Box>
    );
  }

  if (!summary) {
    return (
      <Box p={10} textAlign="center">
        <Typography variant="h6">No summary available.</Typography>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Stack spacing={3} alignItems="center">
        <Typography variant="h4" gutterBottom>
          Quiz Summary
        </Typography>
        <Divider sx={{ width: '100%', maxWidth: 400 }} />

        <Typography variant="body1">
          <strong>User:</strong> {summary.username}
        </Typography>
        <Typography variant="body1">
          <strong>Quiz:</strong> {summary.quizTitle}
        </Typography>
        <Typography variant="body1">
          <strong>Total Questions:</strong> {summary.totalQuestions}
        </Typography>
        <Typography variant="body1">
          <strong>Correct Answers:</strong> {summary.correctAnswers}
        </Typography>
        <Typography variant="body1">
          <strong>Score:</strong> {summary.totalScore}
        </Typography>
        <Typography variant="body1">
          <strong>Rank:</strong> #{summary.rank}
        </Typography>

        <Button variant="contained" color="primary" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Stack>
    </Box>
  );
};

export default QuizSummary;
