import prisma from '../config/prisma';

// Lấy tất cả ưu đãi (mới nhất lên đầu)
export const getAllOffers = async () => {
  return await prisma.offer.findMany({
    orderBy: { createdAt: 'desc' }
  });
};

// Tạo ưu đãi mới (Dành cho trang Admin sau này)
export const createOffer = async (data: any) => {
  return await prisma.offer.create({
    data
  });
};