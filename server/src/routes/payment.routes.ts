import { Router } from 'express';
import express from 'express';
import * as paymentController from '../controllers/payment.controller';

const router = Router();

router.post('/create-session', paymentController.createPaymentSessionHandler);

router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.webhookHandler);

export default router;