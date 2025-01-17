import axios from 'axios';

const axiosOffice = axios.create({
  baseURL: 'http://localhost:8081/api/v1',
});

// Przykład obsługi błędów (opcjonalnie)
axiosOffice.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken'); // Pobranie tokena z localStorage
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`; // Dodanie nagłówka Authorization
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  

export default axiosOffice;
