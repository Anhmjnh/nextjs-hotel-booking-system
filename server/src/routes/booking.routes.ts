import { Router } from 'express';
import * as bookingController from '../controllers/booking.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// Mọi thao tác với Booking đều yêu cầu đăng nhập (verifyToken)
router.use(verifyToken);

router.post('/', bookingController.createBooking);

router.get('/my-bookings', bookingController.getMyBookings);

export default router;