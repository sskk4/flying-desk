import axios from 'axios';

const axiosOffice = axios.create({
  baseURL: 'http://localhost:8081/api/v1',
});

axiosOffice.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosOffice;