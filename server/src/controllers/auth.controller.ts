import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middlewares/auth.middleware';


export const googleLogin = async (req: any, res: any, next: any) => {
  try {
    const result = await authService.googleLogin(req.body);
    
    res.status(200).json({ success: true, data: result, message: 'Đăng nhập Google thành công!' });
  } catch (error) {
    next(error);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Nhận dữ liệu từ Frontend gửi lên 
    const userData = req.body;

    // Gọi Service xử lý logic 
    const newUser = await authService.registerUser(userData);

    // Trả về kết quả thành công cho Frontend
    sendSuccess(res, newUser, 'Đăng ký tài khoản thành công!', 201);
  } catch (error: any) {
    // Nếu có lỗi , gán mã lỗi 400 
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
    error.statusCode = 401; 
    next(error);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    
    const userId = req.user.userId;

    const user = await authService.getUserById(userId);

    sendSuccess(res, user, 'Lấy thông tin cá nhân thành công!');
  } catch (error: any) {
    next(error);
  }
};

export const updateMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.userId;
    const updatedUser = await authService.updateProfile(userId, req.body);
    sendSuccess(res, updatedUser, 'Cập nhật thông tin thành công!');
  } catch (error: any) {
    next(error);
  }
};

export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.userId;
    await authService.changePassword(userId, req.body);
    sendSuccess(res, null, 'Đổi mật khẩu thành công!');
  } catch (error: any) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);
    sendSuccess(res, null, 'Vui lòng kiểm tra email để đặt lại mật khẩu!');
  } catch (error: any) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    sendSuccess(res, null, 'Đặt lại mật khẩu thành công!');
  } catch (error: any) {
    next(error);
  }
};