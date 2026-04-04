import { Response, NextFunction } from 'express';
import * as bookingService from '../services/booking.service';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middlewares/auth.middleware';

export const createBooking = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.userId;
    const bookingData = req.body;

    const newBooking = await bookingService.createBooking(userId, bookingData);
    sendSuccess(res, newBooking, 'Đặt phòng thành công!', 201);
  } catch (error: any) {
    error.statusCode = 400; // Trả về 400 Bad Request nếu đặt sai ngày hoặc hết phòng
    next(error);
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.userId;
    const bookings = await bookingService.getUserBookings(userId);
    sendSuccess(res, bookings, 'Lấy lịch sử đặt phòng thành công!');
  } catch (error: any) {
    next(error);
  }
};