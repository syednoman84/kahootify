import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Typography, Paper, Stack, Alert, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import quizApi from '../utils/quizApi';
import VisibilityIcon from '@mui/icons-material/Visibility';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (localStorage.getItem('role') !== 'ADMIN') navigate('/unauthorized');
  }, [navigate]);

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
      console.error('Error fetching active quiz:', err);
      setError('Failed to fetch active quiz.');
    }
  };

  const fetchAllQuizzes = async () => {
    try {
      const res = await quizApi.get('/admin/quizzes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = Array.isArray(res.data) ? res.data : [];
      setQuizzes(data);
    } catch (err) {
      console.error('Failed to load quizzes', err);
      setError('Error loading quizzes');
    }
  };


  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchActiveQuiz();
      await fetchAllQuizzes();
      setLoading(false);
    };
    load();
  }, []);

  const stopQuiz = async () => {
    if (!activeQuiz) return;
    try {
      await quizApi.post(`/admin/quizzes/${activeQuiz.id}/stop`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchActiveQuiz();
    } catch (err) {
      setError('Failed to stop quiz.');
    }
  };

  const deleteQuiz = async (id) => {
    if (!window.confirm('Delete this quiz?')) return;
    try {
      await quizApi.delete(`/admin/quizzes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchAllQuizzes();
    } catch (err) {
      console.error('Error deleting quiz:', err);
      alert('Failed to delete quiz');
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">Current Active Quiz:</Typography>
        {loading ? (
          <Box textAlign="center"><CircularProgress /><Typography mt={2}>Loading quiz info...</Typography></Box>
        ) : activeQuiz ? (
          <>
            <Typography>Title: {activeQuiz.title}</Typography>
            <Typography>ID: {activeQuiz.id}</Typography>
            <Stack direction="row" spacing={2} mt={2}>
              <Button variant="contained" color="error" onClick={stopQuiz}>Stop Quiz</Button>
            </Stack>
          </>
        ) : <Typography>No active quiz found.</Typography>}
      </Paper>

      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={() => navigate('/admin/create-quiz')}>Create New Quiz</Button>
        <Button variant="outlined" onClick={() => navigate('/admin/questions')}>Manage Questions</Button>
      </Stack>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>All Quizzes</Typography>
        {quizzes.length === 0 ? (
          <Typography>No quizzes available.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Questions</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell>{quiz.id}</TableCell>
                    <TableCell>{quiz.title}</TableCell>
                    <TableCell>{quiz.questions?.length || 0}</TableCell>
                    <TableCell>{new Date(quiz.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => deleteQuiz(quiz.id)}>
                        <DeleteIcon />
                      </IconButton>
                      <IconButton color="primary" onClick={() => navigate(`/admin/quizzes/${quiz.id}/results`)}>
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
