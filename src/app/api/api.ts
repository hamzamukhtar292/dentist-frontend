// src/api.js
import axios from 'axios';

// Create an Axios instance with default configurations
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL, // Use your environment variable for the base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor if needed (e.g., for adding authorization headers)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Example: Get token from local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

