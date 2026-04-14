import prisma from '../config/prisma';

export const getAllRooms = async (queryParams?: any) => {
  const { location, capacity, checkIn, checkOut } = queryParams || {};
  let whereClause: any = { isAvailable: true };

  // 1. Lọc theo vị trí (Gõ Vũng Tàu ra Vũng Tàu)
  if (location && location !== 'all') {
    whereClause.location = { contains: String(location), mode: 'insensitive' };
  }

  // 2. Lọc theo sức chứa
  if (capacity && capacity !== 'all') {
    whereClause.capacity = { gte: Number(capacity) };
  }

  // 3. LOGIC ĐỈNH CAO: CHỐNG TRÙNG LỊCH KHI TÌM KIẾM
  if (checkIn && checkOut) {
    const inDate = new Date(String(checkIn));
    const outDate = new Date(String(checkOut));
    
    // Yêu cầu Prisma: Lọc ra các phòng KHÔNG CÓ đơn đặt nào chồng chéo với ngày khách tìm
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
  const room = await prisma.room.findUnique({ where: { id: Number(roomId) } });
  if (!room) throw new Error('Không tìm thấy phòng!');
  return room;
};

export const createRoom = async (roomData: any) => {
  // Thêm một phòng mới vào Database
  return await prisma.room.create({ data: roomData });
};