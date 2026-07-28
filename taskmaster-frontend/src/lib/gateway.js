import axios from 'axios';

const gateWayApi = axios.create({
  baseURL: 'https://task-master-gateway.onrender.com/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default gateWayApi;