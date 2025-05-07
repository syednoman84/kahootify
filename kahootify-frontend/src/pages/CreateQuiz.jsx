import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
} from '@mui/material';
import quizApi from '../utils/quizApi';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    quizApi
      .get('/admin/questions', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error('Failed to fetch questions', err));
  }, [token]);

  const toggleQuestion = (id) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((qid) => qid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    try {
      await quizApi.post(
        '/admin/quizzes/create',
        {
          title,
          questionIds: selectedQuestions,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Quiz created successfully');
      navigate('/admin/dashboard'); // 👈 Redirect after success
    } catch (err) {
      console.error('Failed to create quiz:', err);
      alert('Failed to create quiz');
    }
  };
  

  return (
    <Box maxWidth={900} mx="auto" mt={4}>
      <Paper elevation={4} sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Quiz
        </Typography>

        <TextField
          fullWidth
          label="Quiz Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Typography variant="h6" gutterBottom>
          Select Questions
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Select</TableCell>
              <TableCell>Question</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Correct Answer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((q) => (
              <TableRow key={q.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedQuestions.includes(q.id)}
                    onChange={() => toggleQuestion(q.id)}
                  />
                </TableCell>
                <TableCell>{q.text}</TableCell>
                <TableCell>{q.type}</TableCell>
                <TableCell>{q.correctAnswer}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box mt={3}>
          <Button variant="contained" onClick={handleSubmit}>
            Create Quiz
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateQuiz;
