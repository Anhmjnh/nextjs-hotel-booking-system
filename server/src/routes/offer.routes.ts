import { Router } from 'express';
import { getOffers, createOffer } from '../controllers/offer.controller';

const router = Router();

// Khai báo các API endpoints
router.get('/', getOffers);
router.post('/', createOffer); // Sẵn sàng cho lúc làm trang Admin

export default router;