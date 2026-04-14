import prisma from '../config/prisma';
import { sendContactEmailToAdmin } from '../utils/email';

export const createContact = async (data: any) => {
  const contact = await prisma.contact.create({ data });
  await sendContactEmailToAdmin(contact);
  return contact;
};