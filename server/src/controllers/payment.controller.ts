import { Request, Response } from 'express';
import { createPaymentSession, handleStripeWebhook } from '../services/payment.service';

export const createPaymentSessionHandler = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.body;
    const result = await createPaymentSession(bookingId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const webhookHandler = async (req: Request, res: Response) => {
  try {
    const sig = req.headers['stripe-signature'] as string;
    await handleStripeWebhook(req.body, sig);
    res.status(200).json({ received: true });
  } catch (error: any) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};