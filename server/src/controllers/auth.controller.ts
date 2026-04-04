import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middlewares/auth.middleware';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Nhận dữ liệu từ Frontend gửi lên (req.body)
    const userData = req.body;

    // Gọi Service xử lý logic (Mã hóa, lưu DB)
    const newUser = await authService.registerUser(userData);

    // Trả về kết quả thành công cho Frontend
    sendSuccess(res, newUser, 'Đăng ký tài khoản thành công!', 201);
  } catch (error: any) {
    // Nếu có lỗi (ví dụ trùng email), gán mã lỗi 400 (Bad Request)
    error.statusCode = 400;
    next(error); 
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = req.body;

    const result = await authService.loginUser(userData);

    sendSuccess(res, result, 'Đăng nhập thành công!');
  } catch (error: any) {
    error.statusCode = 401; // 401: Unauthorized (Không được phép)
    next(error);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Nhờ middleware verifyToken, ta đã biết được userId của người đang gọi API
    const userId = req.user.userId;

    const user = await authService.getUserById(userId);

    sendSuccess(res, user, 'Lấy thông tin cá nhân thành công!');
  } catch (error: any) {
    next(error);
  }
};