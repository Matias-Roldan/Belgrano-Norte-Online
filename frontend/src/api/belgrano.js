import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => {
    if (Array.isArray(response.data) && Array.isArray(response.data[0])) {
      response.data = response.data[0];
    }
    return response;
  },
  (error) => {
    console.error('[BelgranoAPI] Error:', error.message);
    return Promise.reject(error);
  }
);

export default api;