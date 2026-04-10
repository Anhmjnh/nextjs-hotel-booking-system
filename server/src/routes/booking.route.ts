import { Router } from 'express';
import { createBookingHandler, getUserBookingsHandler, cancelBookingHandler } from '../controllers/booking.controller';

const router = Router();

router.post('/', createBookingHandler);
router.get('/my-bookings', getUserBookingsHandler);
router.put('/:id/cancel', cancelBookingHandler);

export default router;