import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
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
  const [timeLeft, setTimeLeft] = useState(10);
  const [hasAnswered, setHasAnswered] = useState(false);
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
          `/player/quiz/${quizId}/question/${sequence}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setQuestionData(res.data);
        setStartTime(Date.now());
        setTimeLeft(10);
        setHasAnswered(false);
      } catch {
        navigate(`/summary/${quizId}`);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [quizId, sequence, token, navigate]);

  useEffect(() => {
    if (!questionData || hasAnswered) return;
    if (timeLeft <= 0) {
      setHasAnswered(true);
      setSequence((seq) => seq + 1);
      return;
    }
    const timerId = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timerId);
  }, [timeLeft, questionData, hasAnswered]);

  const wsBaseUrl = process.env.REACT_APP_QUIZ_SERVICE_URL.replace(/\/$/, '') + '/ws';

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(wsBaseUrl),
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: () => {
        client.subscribe('/topic/quiz-status', (message) => {
          const data = JSON.parse(message.body);
          if (data.status === 'QUIZ_ENDED') {
            navigate(`/summary/${quizId}`);
          }
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers['message']);
      },
    });

    client.activate();
    return () => client.deactivate();
  }, [navigate, token, wsBaseUrl]);

  const handleAnswer = async (selectedAnswer) => {
    if (hasAnswered) return;

    const timeTaken = Date.now() - startTime;
    setHasAnswered(true);

    try {
      await quizApi.post(
        '/player/quiz/answer/submit',
        {
          quizId,
          questionId: questionData.id,
          selectedAnswer,
          timeTakenMillis: timeTaken,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSequence((seq) => seq + 1);
    } catch (err) {
      alert(err.response?.data || 'Error submitting answer');
    }
  };

  if (loading || !questionData)
    return (
      <Box p={10} textAlign="center">
        <CircularProgress />
        <Typography mt={4}>
          {sequence === 1 ? 'Loading first question...' : 'Waiting for next question...'}
        </Typography>
      </Box>
    );

  const isMCQ = !!questionData.optionC;

  const options = isMCQ
    ? ['A', 'B', 'C', 'D'].map((letter) => ({
      label: letter,
      text: questionData[`option${letter}`],
    }))
    : [
      { label: 'A', text: 'True' },
      { label: 'B', text: 'False' }
    ];

  const mcqColors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12']; // red, blue, green, orange

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <Box flexGrow={0} p={2} display="flex" flexDirection="column" alignItems="center">
        <Box position="relative" display="inline-flex">
          <CircularProgress
            variant="determinate"
            value={(timeLeft / 10) * 100}
            size={80}
            thickness={5}
            sx={{ color: timeLeft <= 3 ? 'error.main' : 'primary.main' }}
          />
          <Box
            position="absolute"
            top={0}
            left={0}
            bottom={0}
            right={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h6">{timeLeft}s</Typography>
          </Box>
        </Box>

        <Typography variant="h6" mt={1}>
          Question {questionData.sequenceNumber || sequence} of {questionData.totalQuestions || '?'}
        </Typography>

        <Typography variant="body1" align="left" width="100%" mt={1}>
          {questionData.questionText || 'No question text found'}
        </Typography>
      </Box>

      <Box flexGrow={1} p={2} display="flex" flexDirection="column" justifyContent="center">
        {isMCQ ? (
          [0, 1].map((row) => (
            <Box key={row} display="flex" flex={1} gap={2}>
              {[0, 1].map((col) => {
                const index = row * 2 + col;
                const { label, text } = options[index];
                return (
                  <Button
                    key={index}
                    fullWidth
                    variant="contained"
                    sx={{
                      m: 1,
                      textTransform: 'none',
                      fontSize: '1.2rem',
                      borderRadius: '12px',
                      backgroundColor: mcqColors[index],
                      '&:hover': {
                        backgroundColor: `${mcqColors[index]}cc`,
                      },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      px: 2,
                      flexGrow: 1,
                    }}
                    onClick={() => handleAnswer(label)}
                  >
                    {text}
                  </Button>
                );
              })}
            </Box>
          ))
        ) : (
          <Box display="flex" gap={2} flex={1}>
            {options.map(({ label, text }, idx) => (
              <Button
                key={label}
                fullWidth
                variant="contained"
                color={text === 'True' ? 'success' : 'error'}
                sx={{
                  fontSize: '1.4rem',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexGrow: 1,
                  textTransform: 'none',
                }}
                onClick={() => handleAnswer(label)}
              >
                {text}
              </Button>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LiveQuiz;
