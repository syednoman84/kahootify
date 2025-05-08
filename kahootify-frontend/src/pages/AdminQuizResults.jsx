import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableHead, TableBody, TableRow, TableCell, Paper, CircularProgress
} from '@mui/material';
import { useParams } from 'react-router-dom';
import quizApi from '../utils/quizApi';

const AdminQuizResults = () => {
  const { quizId } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await quizApi.get(`/admin/quizzes/${quizId}/results/detail`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setResults(res.data);
      } catch (err) {
        console.error('Failed to fetch results', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId, token]);

  if (loading) {
    return (
      <Box p={10} textAlign="center">
        <CircularProgress />
        <Typography mt={2}>Loading results...</Typography>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Typography variant="h5" gutterBottom>Quiz Results</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Total Questions</TableCell>
              <TableCell>Correct Answers</TableCell>
              <TableCell>Total Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((res, idx) => (
              <TableRow key={idx}>
                <TableCell>{res.rank}</TableCell>
                <TableCell>{res.username}</TableCell>
                <TableCell>{res.totalQuestions}</TableCell>
                <TableCell>{res.correctAnswers}</TableCell>
                <TableCell>{res.totalScore}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default AdminQuizResults;
