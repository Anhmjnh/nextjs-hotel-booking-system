import prisma from '../config/prisma';

export interface OfferPayload {
  title: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: string | number;
  minOrderValue?: string | number | null;
  maxDiscount?: string | number | null;
  startDate: string | Date;
  endDate: string | Date;
  image: string;
  color?: string;
}

// Lấy tất cả ưu đãi (mới nhất lên đầu)
export const getAllOffers = async () => {
  return await prisma.offer.findMany({
    orderBy: { createdAt: 'desc' }
  });
};

// Tạo ưu đãi mới (Dành cho trang Admin sau này)
export const createOffer = async (data: OfferPayload) => {
  return await prisma.offer.create({
    data: {
      title: data.title,
      code: data.code,
      discountType: data.discountType,
      discountValue: Number(data.discountValue),
      minOrderValue: data.minOrderValue ? Number(data.minOrderValue) : null,
      maxDiscount: data.maxDiscount ? Number(data.maxDiscount) : null,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      image: data.image,
      color: data.color
    }
  });
};

export const updateOffer = async (id: number, data: OfferPayload) => {
  return await prisma.offer.update({
    where: { id },
    data: {
      title: data.title,
      code: data.code,
      discountType: data.discountType,
      discountValue: Number(data.discountValue),
      minOrderValue: data.minOrderValue ? Number(data.minOrderValue) : null,
      maxDiscount: data.maxDiscount ? Number(data.maxDiscount) : null,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      image: data.image,
      color: data.color
    }
  });
};

export const deleteOffer = async (id: number) => {
  return await prisma.offer.delete({
    where: { id }
  });
};