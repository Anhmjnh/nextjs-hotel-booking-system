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
  const token = Cookies.get('token'); // Lấy token từ Cookie trình duyệt
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;