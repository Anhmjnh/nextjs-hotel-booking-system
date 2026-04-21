import { Router } from 'express';
import authRoutes from './auth.routes';
import roomRoutes from './room.routes';
import bookingRoutes from './booking.route';
import paymentRoutes from './payment.routes';
import offerRoutes from './offer.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/rooms', roomRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/offers', offerRoutes);
router.use('/admin', adminRoutes);

export default router;