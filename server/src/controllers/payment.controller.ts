import { Request, Response, NextFunction } from 'express';
import * as paymentService from '../services/payment.service';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middlewares/auth.middleware';
import Stripe from 'stripe';

export const createCheckoutSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { bookingId } = req.body;
    
    const result = await paymentService.createPaymentSession(bookingId);
    sendSuccess(res, result, 'Tạo phiên thanh toán Stripe thành công!');
  } catch (error: any) {
    next(error);
  }
};

export const stripeWebhook = async (req: Request, res: Response, next: NextFunction) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  let event;
  try {
    // @ts-ignore
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-04-10' });
    event = stripe.webhooks.constructEvent(req.body, sig as string, endpointSecret);
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  try {
    await paymentService.handleStripeWebhook(event);
    res.status(200).json({ received: true });
  } catch (error: any) {
    next(error);
  }
};