import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Grid, Divider
} from '@mui/material';
import quizApi from '../utils/quizApi';

const ManageQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({
    text: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: ''
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await quizApi.get('/admin/questions');
      setQuestions(res.data);
    } catch (err) {
      console.error('Failed to load questions', err);
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      await quizApi.post('/admin/questions', form);
      alert('Question added successfully');
      setForm({
        text: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: ''
      });
      fetchQuestions();
    } catch (err) {
      console.error('Failed to add question', err);
      alert('Error adding question');
    }
  };

  return (
    <Box maxWidth={900} mx="auto" mt={4}>
      <Paper elevation={4} sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>Manage Questions</Typography>

        <Typography variant="h6" gutterBottom>Add New Question</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Question Text"
              name="text"
              value={form.text}
              onChange={handleChange}
            />
          </Grid>
          {['A', 'B', 'C', 'D'].map(letter => (
            <Grid item xs={6} sm={3} key={letter}>
              <TextField
                fullWidth
                label={`Option ${letter}`}
                name={`option${letter}`}
                value={form[`option${letter}`]}
                onChange={handleChange}
              />
            </Grid>
          ))}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Correct Answer (A/B/C/D)"
              name="correctAnswer"
              value={form.correctAnswer}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Box mt={2}>
          <Button variant="contained" onClick={handleSubmit}>Add Question</Button>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" gutterBottom>Existing Questions</Typography>
        {questions.length === 0 && <Typography>No questions found.</Typography>}
        {questions.map(q => (
          <Box key={q.id} mb={2} p={2} border="1px solid #ccc" borderRadius={2}>
            <Typography><strong>Q:</strong> {q.text}</Typography>
            <Typography>A: {q.optionA}</Typography>
            <Typography>B: {q.optionB}</Typography>
            <Typography>C: {q.optionC}</Typography>
            <Typography>D: {q.optionD}</Typography>
            <Typography><strong>Correct:</strong> {q.correctAnswer}</Typography>
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default ManageQuestions;
