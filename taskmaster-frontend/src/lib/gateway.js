import axios from 'axios';

const gateWayApi = axios.create({
  baseURL: 'http://localhost:8083/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default gateWayApi;