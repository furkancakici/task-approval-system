import axios from 'axios';

// Create a configured axios instance
export const api = axios.create({
  baseURL: 'http://localhost:4001', // Should be env variable in real app
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized (redirect to login)
      // window.location.href = '/login'; 
      // Better to handle this in the app layer or dispatch logout action
    }
    return Promise.reject(error);
  }
);
