import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
});

// Add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 for protected routes, not for login/register endpoints
    if (error.response?.status === 401) {
      const isAuthEndpoint = error.config?.url?.includes('/auth/login') ||
                            error.config?.url?.includes('/auth/register');

      if (!isAuthEndpoint) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('edusphereUser');
        window.location.href = '/login';
      }
    }

    // Handle network errors (no response)
    if (!error.response) {
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        const networkError = {
          status: 0,
          message: 'Unable to connect to server. Please check if the backend is running.',
        };
        return Promise.reject(networkError);
      }
    }

    // Preserve the original error structure and add response data
    const enhancedError = {
      ...error,
      response: error.response ? {
        ...error.response,
        data: error.response.data
      } : undefined
    };

    return Promise.reject(enhancedError);
  }
);

export default axiosInstance;
