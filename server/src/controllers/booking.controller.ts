import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { createBooking, getUserBookings, cancelBooking } from '../services/booking.service';

// Hàm phụ trợ bóc tách Token để lấy ID của người dùng đang đăng nhập
const getUserIdFromToken = (req: Request) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new Error('Vui lòng đăng nhập!');
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as any;
  return decoded.userId;
};

export const createBookingHandler = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromToken(req);
    const booking = await createBooking(userId, req.body);
    res.status(201).json({ success: true, data: booking });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const cancelBookingHandler = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromToken(req);
    const bookingId = req.params.id as string;
    await cancelBooking(userId, bookingId);
    res.status(200).json({ success: true, message: "Đã hủy đơn thành công" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getUserBookingsHandler = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromToken(req);
    const bookings = await getUserBookings(userId);
    res.status(200).json({ success: true, data: bookings });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};