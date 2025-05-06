import axios from 'axios';

const userApi = axios.create({
  baseURL: process.env.REACT_APP_USER_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default userApi;
