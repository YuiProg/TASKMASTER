import axios from 'axios';

// Reports live on their own service (port 8082), distinct from core (8080)
// and comments (8081). Assumes the same /api/v1 prefix convention.
const reportAxios = axios.create({
  baseURL: 'http://localhost:8082/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default reportAxios;