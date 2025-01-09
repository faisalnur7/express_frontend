import axios, { AxiosInstance as AxiosInstanceType } from 'axios';
import Cookies from 'js-cookie';
import { fireToast } from '../utils/toastify';
// Axios Interceptor Instance
export const AxiosInstance: AxiosInstanceType = axios.create({
  // baseURL: process.env.BASE_URL
});

AxiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token'); // Get the token from cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Axios Interceptor: Response Method
AxiosInstance.interceptors.response.use(
  (response) => {
    // Can be modified response
    return response;
  },
  (error) => {
    if (error.response && error?.response?.data?.error === 'Unauthorized user') {
      fireToast('error', 'Session Expired Please login again');
      setTimeout(() => {
        Cookies.remove('auth_token');
        localStorage.clear();
        window.location.href = '/login';
      }, 800);
    }
    // Handle response errors here
    return Promise.reject(error);
  }
);
