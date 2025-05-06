import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, Checkbox, FormControlLabel, Paper
} from '@mui/material';
import quizApi from '../utils/quizApi';

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  useEffect(() => {
    quizApi.get('/admin/questions')
      .then(res => setQuestions(res.data))
      .catch(err => console.error('Failed to fetch questions', err));
  }, []);

  const toggleQuestion = (id) => {
    setSelectedQuestions(prev =>
      prev.includes(id) ? prev.filter(qid => qid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    try {
      await quizApi.post('/admin/quizzes', {
        title,
        questionIds: selectedQuestions
      });
      alert('Quiz created successfully');
    } catch (err) {
      console.error('Failed to create quiz:', err);
      alert('Failed to create quiz');
    }
  };

  return (
    <Box maxWidth={800} mx="auto" mt={4}>
      <Paper elevation={4} sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>Create New Quiz</Typography>
        <TextField
          fullWidth
          label="Quiz Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 3 }}
        />
        <Typography variant="h6" gutterBottom>Select Questions</Typography>
        {questions.map(q => (
          <FormControlLabel
            key={q.id}
            control={
              <Checkbox
                checked={selectedQuestions.includes(q.id)}
                onChange={() => toggleQuestion(q.id)}
              />
            }
            label={q.text}
          />
        ))}
        <Box mt={3}>
          <Button variant="contained" onClick={handleSubmit}>Create Quiz</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateQuiz;
