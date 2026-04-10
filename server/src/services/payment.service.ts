import prisma from '../config/prisma';
import Stripe from 'stripe';

// Khởi tạo Stripe với Secret Key
// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-04-10' });

export const createPaymentSession = async (bookingId: string | number) => {
  // 1. Lấy thông tin đơn đặt phòng kèm theo thông tin User và Room
  const booking = await prisma.booking.findUnique({
    where: { id: Number(bookingId) },
    include: { room: true, user: true }
  });

  if (!booking) throw new Error('Không tìm thấy đơn đặt phòng!');
  if (booking.status !== 'PENDING') throw new Error('Đơn đặt phòng này không ở trạng thái chờ thanh toán!');

  // 2. Tạo phiên thanh toán (Checkout Session) trên hệ thống Stripe
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
          unit_amount: booking.totalPrice, // Stripe yêu cầu số tiền nguyên (VND không có số thập phân)
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    // Cấu hình đường dẫn trả về sau khi quẹt thẻ xong (Sẽ dẫn về NextJS Frontend)
    success_url: `http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://localhost:3000/payment/cancel`,
    metadata: {
      bookingId: booking.id.toString(), // Nhúng ID booking vào để sau này Stripe báo về mình còn biết của đơn nào
    },
  });

  // 3. Trả về URL quẹt thẻ của Stripe để Frontend chuyển hướng
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
      // 1. Cập nhật trạng thái Booking thành CONFIRMED (Đã xác nhận)
      await prisma.booking.update({
        where: { id: Number(bookingId) },
        data: { status: 'CONFIRMED' }
      });

      // 2. Tạo bản ghi Payment lưu vào Database
      await prisma.payment.create({
        data: {
          bookingId: Number(bookingId),
          stripeSessionId: session.id,
          amount: session.amount_total ? session.amount_total : 0,
          status: 'PAID',
          paymentDate: new Date(),
        }
      });
    }
  }
};