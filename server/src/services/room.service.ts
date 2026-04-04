import prisma from '../config/prisma';

export const getAllRooms = async () => {
  // Lấy toàn bộ danh sách phòng từ Database
  return await prisma.room.findMany();
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