import { Router } from 'express';
import { createBookingHandler, getUserBookingsHandler, cancelBookingHandler, validateOffer } from '../controllers/booking.controller';

const router = Router();

router.post('/', createBookingHandler);
router.get('/my-bookings', getUserBookingsHandler);
router.put('/:id/cancel', cancelBookingHandler);
router.post('/validate-offer', validateOffer);


export default router;