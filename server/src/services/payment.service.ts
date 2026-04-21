import prisma from '../config/prisma';
import Stripe from 'stripe';
import { sendBookingConfirmationEmail } from '../utils/email';

// Khởi tạo Stripe với Secret Key
// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-04-10' });

export const createPaymentSession = async (bookingId: string | number) => {
  const parsedId = Number(bookingId);
  if (isNaN(parsedId)) {
    throw new Error('ID đơn đặt phòng không hợp lệ!');
  }

  // Lấy thông tin đơn đặt phòng kèm theo thông tin User và Room
  const booking = await prisma.booking.findUnique({
    where: { id: parsedId },
    include: { room: true, user: true }
  });

  if (!booking) throw new Error('Không tìm thấy đơn đặt phòng!');
  if (booking.status !== 'PENDING') throw new Error('Đơn đặt phòng này không ở trạng thái chờ thanh toán!');

  //  Tạo phiên thanh toán  trên  Stripe
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: booking.user.email,
    line_items: [
      {
        price_data: {
          currency: 'vnd',
          product_data: {
            name: `Phòng: ${booking.room.name}`,
            description: `${booking.totalDays} đêm tại khách sạn`,
          },
          unit_amount: booking.totalPrice, 
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    // Cấu hình đường dẫn trả về sau khi quẹt thẻ xong )
    success_url: `http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://localhost:3000/payment/cancel`,
    metadata: {
      bookingId: booking.id.toString(), 
    },
  });

  //  Trả về URL quẹt thẻ của Stripe để Frontend chuyển hướng
  return { checkoutUrl: session.url, sessionId: session.id };
};

export const handleStripeWebhook = async (body: Buffer, sig: string) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  if (!webhookSecret) {
    throw new Error('Chưa cấu hình Stripe Webhook Secret trong file .env!');
  }

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    throw new Error(`Webhook signature verification failed: ${err.message}`);
  }

  // Chỉ xử lý khi khách hàng đã thanh toán thành công
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const bookingId = session.metadata?.bookingId;

    if (bookingId) {
      //  Cập nhật trạng thái Booking thành CONFIRMED (Đã xác nhận)
      const updatedBooking = await prisma.booking.update({
        where: { id: Number(bookingId) },
        data: { status: 'CONFIRMED' },
        include: { user: true, room: true }
      });

      //  Tạo bản ghi Payment lưu vào Database
      await prisma.payment.create({
        data: {
          bookingId: Number(bookingId),
          stripeSessionId: session.id,
          amount: session.amount_total ? session.amount_total : 0,
          status: 'PAID',
          paymentDate: new Date(),
        }
      });

      //  Gửi Email xác nhận sau khi Stripe báo thanh toán hoàn tất
      await sendBookingConfirmationEmail(updatedBooking);
    }
  }
};