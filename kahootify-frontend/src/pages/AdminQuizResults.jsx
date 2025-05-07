import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import quizApi from '../utils/quizApi';
import { getToken } from '../utils/auth';
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';

const AdminQuizResults = () => {
  const { quizId } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = getToken();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await quizApi.get(`/admin/quizzes/${quizId}/results`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(res.data);
      } catch (err) {
        console.error('Error fetching results', err);
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

  if (!results.length) {
    return (
      <Box p={10} textAlign="center">
        <Typography>No results found for this quiz.</Typography>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Typography variant="h4" mb={4}>
        Results for Quiz #{quizId}
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>User</strong></TableCell>
              <TableCell><strong>Score</strong></TableCell>
              <TableCell><strong>Correct Answers</strong></TableCell>
              <TableCell><strong>Total Time (s)</strong></TableCell>
              <TableCell><strong>Rank</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{row.username}</TableCell>
                <TableCell>{row.totalScore}</TableCell>
                <TableCell>{row.correctAnswers}</TableCell>
                <TableCell>{Math.round(row.totalTimeMillis / 1000)}</TableCell>
                <TableCell>#{row.rank}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default AdminQuizResults;
