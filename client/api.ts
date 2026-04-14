import axios from 'axios';
import Cookies from 'js-cookie';

// Khởi tạo một instance của Axios với cấu hình mặc định
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Trước khi gửi bất kỳ request nào, tự động đính kèm Token nếu có
api.interceptors.request.use((config) => {
  const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  const token = Cookies.get(isAdminRoute ? 'admin_token' : 'token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;