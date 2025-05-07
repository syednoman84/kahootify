import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  Alert,
  CircularProgress
} from '@mui/material';
import quizApi from '../utils/quizApi';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token'); // ✅ Token once at top

  // ✅ Ensure only Admin can access
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'ADMIN') {
      navigate('/unauthorized');
    }
  }, [navigate]);

  // ✅ Fetch quiz info
  const fetchActiveQuiz = async () => {
    try {
      const res = await quizApi.get('/player/quiz/waitingoractive', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.active) {
        setActiveQuiz({
          id: res.data.quizId,
          title: res.data.title,
          totalQuestions: res.data.totalQuestions
        });
      } else {
        setActiveQuiz(null);
      }
    } catch (err) {
      console.error('Error fetching quiz:', err);
      setError('Failed to fetch active quiz.');
    }
  };

  useEffect(() => {
    const loadQuiz = async () => {
      setLoading(true);
      await fetchActiveQuiz();
      setLoading(false);
    };

    loadQuiz();
  }, []);

  // ✅ Stop quiz handler
  const stopQuiz = async () => {
    if (!activeQuiz || !activeQuiz.id) {
      setError('No active quiz to stop.');
      return;
    }

    try {
      await quizApi.post(`/admin/quizzes/${activeQuiz.id}/stop`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchActiveQuiz();
    } catch (err) {
      console.error('Error stopping quiz:', err);
      setError('Failed to stop quiz.');
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Current Active Quiz:</Typography>

        {loading ? (
          <Box textAlign="center">
            <CircularProgress />
            <Typography mt={2}>Loading quiz info...</Typography>
          </Box>
        ) : activeQuiz ? (
          <>
            <Typography>Title: {activeQuiz.title}</Typography>
            <Typography>ID: {activeQuiz.id}</Typography>
            <Stack direction="row" spacing={2} mt={2}>
              <Button
                variant="contained"
                color="error"
                onClick={stopQuiz}
                disabled={!activeQuiz}
              >
                Stop Quiz
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate(`/admin/quizzes/${activeQuiz.id}/results`)}
                disabled={!activeQuiz}
              >
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
