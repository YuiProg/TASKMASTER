import axios from 'axios';

const commentsApi = axios.create({
  baseURL: 'http://localhost:8081/api/v1/comments',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default commentsApi;