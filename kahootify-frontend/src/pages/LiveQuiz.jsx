import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';
import quizApi from '../utils/quizApi';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const LiveQuiz = () => {
  const [quizId, setQuizId] = useState(null);
  const [questionData, setQuestionData] = useState(null);
  const [sequence, setSequence] = useState(1);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState(null);
  const navigate = useNavigate();

  const token = getToken();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await quizApi.get('/player/quiz/waitingoractive', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data && res.data.quizId) {
          setQuizId(res.data.quizId);
        } else {
          navigate('/waiting');
        }
      } catch {
        navigate('/waiting');
      }
    };

    fetchQuiz();
  }, [token, navigate]);

  useEffect(() => {
    const fetchQuestion = async () => {
      if (!quizId) return;
      setLoading(true);
      try {
        const res = await quizApi.get(
          `/player/quizzes/${quizId}/questions/${sequence}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setQuestionData(res.data);
        setStartTime(Date.now());
      } catch {
        // Don't redirect on error here — wait for QUIZ_ENDED signal
        setQuestionData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [quizId, sequence, token]);

const wsBaseUrl = process.env.REACT_APP_QUIZ_SERVICE_URL.replace(/\/$/, '') + '/ws'; 

useEffect(() => {
  const client = new Client({
    webSocketFactory: () => new SockJS(wsBaseUrl),
    connectHeaders: { Authorization: `Bearer ${token}` },
    onConnect: () => {
      client.subscribe('/topic/quiz-status', (message) => {
        const data = JSON.parse(message.body);
        if (data.status === 'QUIZ_ENDED') {
          navigate('/summary');
        }
      });
    },
    onStompError: (frame) => {
      console.error('STOMP error:', frame.headers['message']);
    }
  });

  client.activate();
  return () => client.deactivate();
}, [navigate, token, wsBaseUrl]);

  const handleAnswer = async (selectedAnswer) => {
    const timeTaken = Date.now() - startTime;

    try {
      await quizApi.post(
        '/player/submit',
        {
          quizId,
          questionId: questionData.questionId,
          selectedAnswer,
          timeTakenMillis: timeTaken,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTimeout(() => {
        setSequence((seq) => seq + 1);
      }, 1000);
    } catch (err) {
      alert(err.response?.data || 'Error submitting answer');
    }
  };

  if (loading || !questionData)
    return (
      <Box p={10} textAlign="center">
        <CircularProgress />
        <Typography mt={4}>Waiting for next question...</Typography>
      </Box>
    );

  return (
    <Box p={6}>
      <Stack spacing={4} alignItems="center">
        <Typography variant="h5" fontWeight="bold">
          Question {questionData.sequenceNumber} of {questionData.totalQuestions}
        </Typography>
        <Typography variant="h6">{questionData.text}</Typography>

        {questionData.optionC ? (
          <Grid container spacing={2} maxWidth="600px">
            {['A', 'B', 'C', 'D'].map((letter) => (
              <Grid item xs={12} sm={6} key={letter}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() =>
                    handleAnswer(questionData[`option${letter}`])
                  }
                >
                  {questionData[`option${letter}`]}
                </Button>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Stack direction="row" spacing={4}>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleAnswer('True')}
            >
              True
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleAnswer('False')}
            >
              False
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default LiveQuiz;
