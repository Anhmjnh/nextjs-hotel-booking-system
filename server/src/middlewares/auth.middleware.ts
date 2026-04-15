import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Mở rộng Request mặc định của Express để chứa thêm thông tin user
export interface AuthRequest extends Request {
  user?: any;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    // Lấy token từ header "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Không tìm thấy Token, vui lòng đăng nhập!' });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Giải mã token để lấy thông tin 
    const secret = process.env.JWT_SECRET || 'default_secret';
    const decoded = jwt.verify(token, secret);

    // Gắn thông tin user vào request để các hàm phía sau có thể dùng
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn!' });
  }
};