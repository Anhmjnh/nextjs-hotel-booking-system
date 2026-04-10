import { Router } from 'express';
import { createPaymentSessionHandler, webhookHandler } from '../controllers/payment.controller';

const router = Router();

router.post('/create-session', createPaymentSessionHandler);
router.post('/webhook', webhookHandler);

export default router;