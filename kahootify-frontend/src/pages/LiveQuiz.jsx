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
        // No more questions available, end the quiz for this user
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
    ? ['A', 'B', 'C', 'D'].map((letter) => questionData[`option${letter}`])
    : ['True', 'False'];
    const mcqColors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12']; // red, blue, green, orange

  return (
    <Box p={4} height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Stack spacing={4} alignItems="center" width="100%">
        <Typography variant="h4" fontWeight="bold" color="primary">
          Time Left: {timeLeft}s
        </Typography>

        <Typography variant="h5" fontWeight="bold">
          Question {questionData.sequenceNumber || sequence} of {questionData.totalQuestions || '?'}
        </Typography>

        <Typography variant="h6" textAlign="center">
          {questionData.questionText || 'No question text found'}
        </Typography>

        <Stack spacing={3} width="100%" maxWidth="1000px">
          {isMCQ ? (
            [0, 1].map((row) => (
              <Box key={row} display="flex" gap={3} width="100%">
                {[0, 1].map((col) => {
                  const index = row * 2 + col;
                  const text = options[index];
                  return (
                    <Box key={index} flex={1}>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{
                          height: '200px',
                          fontSize: '1.6rem',
                          borderRadius: '16px',
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                          backgroundColor: mcqColors[index],
                          '&:hover': {
                            backgroundColor: `${mcqColors[index]}cc`, // lighter on hover
                          }
                        }}
                        onClick={() => handleAnswer(text)}
                      >
                        {text}
                      </Button>
                    </Box>
                  );
                })}
              </Box>
            ))
          ) : (
            <Box display="flex" gap={3} width="100%">
              {options.map((val, idx) => (
                <Box key={val} flex={1}>
                  <Button
                    fullWidth
                    variant="contained"
                    color={val === 'True' ? 'success' : 'error'}
                    sx={{
                      height: '200px',
                      fontSize: '1.8rem',
                      borderRadius: '16px',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                    }}
                    onClick={() => handleAnswer(val)}
                  >
                    {val}
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default LiveQuiz;
