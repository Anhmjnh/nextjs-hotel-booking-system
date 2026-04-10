import { Request, Response } from 'express';
import * as offerService from '../services/offer.service';

export const getOffers = async (req: Request, res: Response) => {
  try {
    const offers = await offerService.getAllOffers();
    res.status(200).json({ success: true, data: offers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createOffer = async (req: Request, res: Response) => {
  try {
    const offer = await offerService.createOffer(req.body);
    res.status(201).json({ success: true, data: offer });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};