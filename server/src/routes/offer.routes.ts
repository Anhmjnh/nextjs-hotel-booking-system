import { Router } from 'express';
import { getOffers, createOffer } from '../controllers/offer.controller';

const router = Router();

// Khai báo các API endpoints
router.get('/', getOffers);
router.post('/', createOffer); 

export default router;