import axios from 'axios';
import { tokenService } from './tokenService';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
});

axiosInstance.interceptors.request.use(
  config => {
    const token = tokenService.getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && error.response.data?.message.includes('JWT expired')) {
      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const refreshToken = tokenService.getRefreshToken();
        if (!refreshToken) {
          throw new Error('Brak refresh tokena.');
        }

        const response = await axios.post('http://localhost:8080/api/v1/auth/refresh', {
          refreshToken,
        });

        const newAccessToken = response.data.accessToken;
        tokenService.setAccessToken(newAccessToken);

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Błąd odświeżania tokenu:', refreshError);
        tokenService.clearTokens();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
