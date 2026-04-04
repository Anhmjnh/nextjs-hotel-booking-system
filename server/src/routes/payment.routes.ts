import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// Mọi thao tác thanh toán đều yêu cầu đăng nhập
router.post('/create-checkout-session', verifyToken, paymentController.createCheckoutSession);

// Webhook không cần verifyToken (Vì hệ thống máy chủ Stripe sẽ tự động gọi vào đây)
router.post('/webhook', paymentController.stripeWebhook);

export default router;