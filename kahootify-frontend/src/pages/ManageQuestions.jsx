import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Divider, Stack, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton
} from '@mui/material';
import quizApi from '../utils/quizApi';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const ManageQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({
    text: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: '',
    type: 'MCQ'
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await quizApi.get('/admin/questions', {
        headers: { Authorization: `Bearer ${token}` }
      });
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
      let payload = { ...form };

      if (form.type === 'TRUE_FALSE') {
        payload.optionA = 'True';
        payload.optionB = 'False';
        payload.optionC = '';
        payload.optionD = '';
      }

      if (form.id) {
        // EDIT mode – send PUT request
        await quizApi.put(`/admin/questions/${form.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Question updated successfully');
      } else {
        // ADD mode – send POST request
        await quizApi.post('/admin/questions', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Question added successfully');
      }

      // Reset form
      setForm({
        text: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: '',
        type: 'MCQ',
        id: undefined, // reset ID after submit
      });

      fetchQuestions();
    } catch (err) {
      console.error('Failed to submit question', err);
      alert('Error submitting question');
    }
  };


  const handleEdit = (question) => {
    setForm({
      text: question.text,
      optionA: question.optionA || '',
      optionB: question.optionB || '',
      optionC: question.optionC || '',
      optionD: question.optionD || '',
      correctAnswer: question.correctAnswer,
      type: question.type,
      id: question.id, // Add id to form state for update
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await quizApi.delete(`/admin/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchQuestions();
    } catch (err) {
      console.error('Failed to delete question', err);
      alert('Error deleting question');
    }
  };

  return (
    <Box maxWidth={1100} mx="auto" mt={4}>
      <Paper elevation={4} sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>Manage Questions</Typography>

        <Typography variant="h6" gutterBottom>Add New Question</Typography>

        <Stack spacing={2}>
          <TextField
            select
            fullWidth
            label="Question Type"
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            <MenuItem value="MCQ">Multiple Choice (MCQ)</MenuItem>
            <MenuItem value="TRUE_FALSE">True / False</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Question Text"
            name="text"
            value={form.text}
            onChange={handleChange}
          />

          {form.type === 'MCQ' && (
            <>
              {['A', 'B', 'C', 'D'].map(letter => (
                <TextField
                  key={letter}
                  fullWidth
                  label={`Option ${letter}`}
                  name={`option${letter}`}
                  value={form[`option${letter}`]}
                  onChange={handleChange}
                />
              ))}
              <TextField
                fullWidth
                label="Correct Answer (A/B/C/D)"
                name="correctAnswer"
                value={form.correctAnswer}
                onChange={handleChange}
              />
            </>
          )}

          {form.type === 'TRUE_FALSE' && (
            <TextField
              fullWidth
              label="Correct Answer (A/B)"
              name="correctAnswer"
              value={form.correctAnswer}
              onChange={handleChange}
              helperText="Choose A for True or B for False"
            />
          )}

          <Button variant="contained" onClick={handleSubmit}>
            {form.id ? 'Update Question' : 'Add Question'}
          </Button>
        </Stack>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" gutterBottom>Existing Questions</Typography>

        {questions.length === 0 ? (
          <Typography>No questions found.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Question</TableCell>
                  <TableCell>Options</TableCell>
                  <TableCell>Answer</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {questions.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell>{q.type}</TableCell>
                    <TableCell>{q.text}</TableCell>
                    <TableCell>
                      {q.optionA && <>A: {q.optionA}<br /></>}
                      {q.optionB && <>B: {q.optionB}<br /></>}
                      {q.optionC && <>C: {q.optionC}<br /></>}
                      {q.optionD && <>D: {q.optionD}</>}
                    </TableCell>
                    <TableCell>{q.correctAnswer}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEdit(q)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(q.id)}>
                        <DeleteIcon />
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

export default ManageQuestions;
