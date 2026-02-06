import axios from 'axios';
import { getToken } from '../utils/storage';

const api = axios.create({
  baseURL: 'http://TU_BACKEND_URL/api',
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    console.log('🟡 Token sent:', token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
