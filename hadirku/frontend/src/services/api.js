import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hadirku_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor to handle responses and 401 unauth
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid/expired and not already on login page
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('hadirku_token');
        localStorage.removeItem('hadirku_user');
      }
    }
    const message = error.response?.data?.message || error.message || 'Terjadi kesalahan pada sistem.';
    return Promise.reject(new Error(message));
  }
);

export default api;
