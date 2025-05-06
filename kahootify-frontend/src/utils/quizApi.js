import axios from 'axios';

const quizApi = axios.create({
  baseURL: process.env.REACT_APP_QUIZ_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default quizApi;
