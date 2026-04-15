import prisma from '../config/prisma';

export const getAllRooms = async (queryParams?: any) => {
  const { location, capacity, checkIn, checkOut } = queryParams || {};
  let whereClause: any = { isAvailable: true };

  // 1. Lọc theo vị trí
  if (location && location !== 'all') {
    whereClause.location = { contains: String(location), mode: 'insensitive' };
  }

  // 2. Lọc theo sức chứa
  if (capacity && capacity !== 'all') {
    whereClause.capacity = { gte: Number(capacity) };
  }

  // 3. LOGIC : CHỐNG TRÙNG LỊCH KHI TÌM KIẾM
  if (checkIn && checkOut) {
    const inDate = new Date(String(checkIn));
    const outDate = new Date(String(checkOut));
    
    
    whereClause.bookings = {
      none: {
        status: { not: 'CANCELLED' }, // Bỏ qua đơn đã hủy
        AND: [
          { checkInDate: { lt: outDate } },
          { checkOutDate: { gt: inDate } }
        ]
      }
    };
  }

  return await prisma.room.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' }
  });
};

export const getRoomById = async (roomId: string | number) => {
  const room = await prisma.room.findUnique({ 
    where: { id: Number(roomId) },
    include: {
      reviews: {
        include: {
          user: { select: { id: true, name: true, avatar: true } }
        },
        orderBy: { createdAt: 'desc' }
      },
    }
  });
  if (!room) throw new Error('Không tìm thấy phòng!');

  const aggregates = await prisma.review.aggregate({
    where: { roomId: Number(roomId) },
    _avg: { rating: true },
    _count: { rating: true }
  });

  return {
    ...room,
    averageRating: aggregates._avg.rating ? parseFloat(aggregates._avg.rating.toFixed(1)) : 0,
    reviewCount: aggregates._count.rating
  };
};

export const getTopChoiceRooms = async () => {
 
  return await prisma.room.findMany({
    where: { isAvailable: true },
    include: {
      _count: {
        select: {
          bookings: {
            where: { status: { not: 'CANCELLED' } }
          }
        }
      }
    },
    orderBy: [
      {
        bookings: {
          _count: 'desc'
        }
      },
      {
        createdAt: 'desc'
      }
    ],
    take: 8
  });
};

export const createReview = async (userId: number, roomId: number, data: { rating: number, comment?: string }) => {
  const { rating, comment } = data;

  if (rating < 1 || rating > 5) {
    throw new Error('Điểm đánh giá phải từ 1 đến 5.');
  }

  //  User chỉ được review phòng họ đã ở
  const validBooking = await prisma.booking.findFirst({
    where: {
      userId: userId,
      roomId: roomId,
      status: 'COMPLETED'
    }
  });

  if (!validBooking) {
    throw new Error('Bạn chỉ có thể đánh giá phòng sau khi đã hoàn thành chuyến đi.');
  }

  // Luôn tạo đánh giá mới thay vì ghi đè (upsert)
  return await prisma.review.create({
    data: { rating, comment, userId, roomId }
  });
};

export const updateReview = async (userId: number, reviewId: number, data: { rating: number, comment?: string }) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });

  if (!review) {
    throw new Error('Không tìm thấy đánh giá!');
  }

  if (review.userId !== userId) {
    throw new Error('Bạn không có quyền sửa đánh giá này!');
  }

  return await prisma.review.update({
    where: { id: reviewId },
    data: {
      rating: data.rating,
      comment: data.comment,
    },
  });
};

export const deleteReview = async (user: { userId: number, role: string }, reviewId: number) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });

  if (!review) {
    throw new Error('Không tìm thấy đánh giá!');
  }

  // Cho phép xóa nếu user là chủ sở hữu HOẶC user là ADMIN
  if (review.userId !== user.userId && user.role !== 'ADMIN') {
    throw new Error('Bạn không có quyền xóa đánh giá này!');
  }

  return await prisma.review.delete({
    where: { id: reviewId },
  });
};

export const createRoom = async (roomData: any) => {
  // Thêm một phòng mới vào Database
  return await prisma.room.create({ data: roomData });
};