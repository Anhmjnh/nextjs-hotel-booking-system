import { Router } from 'express';
import authRoutes from './auth.routes';
import roomRoutes from './room.routes';
import bookingRoutes from './booking.route';
import paymentRoutes from './payment.route';
import offerRoutes from './offer.routes';

const router = Router();

// Gom nhóm tất cả route của ứng dụng
router.use('/auth', authRoutes);
router.use('/rooms', roomRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/offers', offerRoutes);

export default router;