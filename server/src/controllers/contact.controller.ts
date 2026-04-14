import { Request, Response } from 'express';
import { createContact } from '../services/contact.service';

export const submitContact = async (req: Request, res: Response) => {
  try {
    await createContact(req.body);
    res.status(201).json({ success: true, message: 'Gửi liên hệ thành công!' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};