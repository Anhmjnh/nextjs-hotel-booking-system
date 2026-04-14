import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { createBooking, getUserBookings, cancelBooking } from '../services/booking.service';
import { createPaymentSession } from '../services/payment.service';
import prisma from '../config/prisma';
import { sendBookingConfirmationEmail } from '../utils/email';

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

    if (booking.paymentMethod === 'ONLINE') {
      // Nếu là Online, gọi Stripe lấy link
      const session = await createPaymentSession(booking.id);
      res.status(201).json({ success: true, data: { checkoutUrl: session.checkoutUrl }, message: 'Đang chuyển hướng đến cổng thanh toán...' });
    } else {
      // Nếu là Tiền mặt, trả về thẳng trang Success của Frontend
      // Gửi email xác nhận ngay lập tức
      await sendBookingConfirmationEmail(booking);
      res.status(201).json({ success: true, data: { checkoutUrl: `/payment/success?bookingId=${booking.id}` }, message: 'Đặt phòng thành công!' });
    }
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

export const validateOffer = async (req: Request, res: Response) => {
  try {
    const { code, orderValue } = req.body;
    const offer = await prisma.offer.findUnique({ where: { code } });
    if (!offer) throw new Error("Mã giảm giá không tồn tại!");
    
    const now = new Date();
    if (now < offer.startDate || now > offer.endDate) throw new Error("Mã giảm giá đã hết hạn hoặc chưa áp dụng!");
    if (offer.minOrderValue && orderValue < offer.minOrderValue) throw new Error(`Đơn hàng cần đạt tối thiểu ${offer.minOrderValue.toLocaleString('vi-VN')}đ`);

    let discount = offer.discountType === 'FIXED' ? offer.discountValue : (orderValue * offer.discountValue) / 100;
    if (offer.discountType === 'PERCENTAGE' && offer.maxDiscount && discount > offer.maxDiscount) discount = offer.maxDiscount;
    if (discount > orderValue) discount = orderValue;

    res.status(200).json({ success: true, data: { discount, code: offer.code }, message: "Áp dụng mã giảm giá thành công!" });
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