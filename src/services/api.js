import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true // Important for cookies (refreshToken)
});

// Interceptor to add Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('reconx_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Interceptor to handle token refresh automatically
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post('http://localhost:3001/api/auth/refresh', {}, { withCredentials: true });
        localStorage.setItem('reconx_access_token', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, clear everything
        localStorage.removeItem('reconx_access_token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
