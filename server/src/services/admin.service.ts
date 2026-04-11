import prisma from '../config/prisma';
import bcrypt from 'bcrypt';

export const getDashboardStats = async () => {
  // 1. Đếm số lượng
  const totalUsers = await prisma.user.count({ where: { role: 'USER' } });
  const totalRooms = await prisma.room.count();
  const totalBookings = await prisma.booking.count();

  // 2. Tính tổng doanh thu (Chỉ tính những đơn đã Xác nhận / Đã thanh toán)
  const confirmedBookings = await prisma.booking.findMany({
    where: { status: 'CONFIRMED' },
    select: { totalPrice: true, createdAt: true }
  });
  const totalRevenue = confirmedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

  // 3. Tính toán dữ liệu Biểu đồ doanh thu theo từng tháng của năm hiện tại
  const currentYear = new Date().getFullYear();
  const monthlyRevenue = Array.from({ length: 12 }, (_, i) => ({
    month: `T${i + 1}`,
    revenue: 0,
    value: 0, // Phần trăm chiều cao cột trên biểu đồ
    amount: "0đ" // Định dạng chữ hiển thị (VD: 15M, 500K)
  }));

  let maxRevenue = 0;

  // Cộng dồn doanh thu vào đúng tháng
  confirmedBookings.forEach(booking => {
    const date = new Date(booking.createdAt);
    if (date.getFullYear() === currentYear) {
      const monthIndex = date.getMonth(); // Lấy ra tháng (0 - 11)
      monthlyRevenue[monthIndex].revenue += booking.totalPrice;
      if (monthlyRevenue[monthIndex].revenue > maxRevenue) {
        maxRevenue = monthlyRevenue[monthIndex].revenue;
      }
    }
  });

  // Quy đổi ra phần trăm cột và định dạng số tiền cho đẹp
  monthlyRevenue.forEach(item => {
    item.value = maxRevenue > 0 ? Math.round((item.revenue / maxRevenue) * 100) : 0;
    if (item.revenue >= 1000000) {
      item.amount = (item.revenue / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'; // Triệu
    } else if (item.revenue >= 1000) {
      item.amount = (item.revenue / 1000).toFixed(1).replace(/\.0$/, '') + 'K'; // Ngàn
    } else {
      item.amount = item.revenue > 0 ? item.revenue + 'đ' : '0đ';
    }
  });

  return {
    totalUsers,
    totalRooms,
    totalBookings,
    totalRevenue,
    monthlyRevenue
  };
};

// --- QUẢN LÝ PHÒNG (ADMIN) ---
export const getAdminRooms = async () => {
  return await prisma.room.findMany({
    orderBy: { createdAt: 'desc' }
  });
};

export const deleteRoom = async (roomId: number) => {
  return await prisma.room.delete({
    where: { id: roomId }
  });
};

export const getAdminRoomById = async (roomId: number) => {
  return await prisma.room.findUnique({ where: { id: roomId } });
};

export const createRoom = async (data: any) => {
  return await prisma.room.create({
    data
  });
};

export const updateRoom = async (roomId: number, data: any) => {
  return await prisma.room.update({
    where: { id: roomId },
    data
  });
};

// --- QUẢN LÝ ĐƠN ĐẶT PHÒNG (ADMIN) ---
export const getAdminBookings = async () => {
  return await prisma.booking.findMany({
    include: {
      user: { select: { name: true, email: true, phone: true } },
      room: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const updateBookingStatus = async (bookingId: number, status: any) => {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new Error('Không tìm thấy đơn đặt phòng!');

  if (booking.status === 'CONFIRMED' || booking.status === 'CANCELLED') {
    throw new Error('Không thể thay đổi trạng thái của đơn đã Xác nhận hoặc Đã hủy!');
  }

  return await prisma.booking.update({
    where: { id: bookingId },
    data: { status }
  });
};

// --- QUẢN LÝ NGƯỜI DÙNG (ADMIN) ---
export const getAdminUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const updateUserRole = async (adminId: number, targetUserId: number, role: any) => {
  if (adminId === targetUserId) {
    throw new Error('Không thể tự thay đổi quyền của chính mình!');
  }

  // Luật Admin cuối cùng: Nếu đang giáng chức 1 Admin xuống USER
  if (role === 'USER') {
    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (targetUser?.role === 'ADMIN') {
      const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
      if (adminCount <= 1) throw new Error('Hệ thống phải có ít nhất 1 Quản trị viên!');
    }
  }

  return await prisma.user.update({
    where: { id: targetUserId },
    data: { role }
  });
};

export const updateUserInfo = async (adminId: number, targetUserId: number, data: any) => {
  const updateData: any = { name: data.name, phone: data.phone };

  const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!targetUser) throw new Error("Không tìm thấy người dùng!");

  // Nếu Admin có nhập mật khẩu mới, tiến hành băm (hash) mật khẩu đó
  if (data.password && data.password.trim() !== '') {
    // Bảo mật: Nếu đổi mật khẩu của Admin, bắt buộc phải xác thực mật khẩu cũ
    if (targetUser.role === 'ADMIN') {
      if (!data.oldPassword) throw new Error("Yêu cầu nhập mật khẩu cũ để đổi mật khẩu Quản trị viên!");
      const isMatch = await bcrypt.compare(data.oldPassword, targetUser.password);
      if (!isMatch) throw new Error("Mật khẩu cũ không chính xác!");
    }

    const saltRounds = 10;
    updateData.password = await bcrypt.hash(data.password, saltRounds);
  }

  return await prisma.user.update({
    where: { id: targetUserId },
    data: updateData
  });
};

export const deleteUser = async (adminId: number, targetUserId: number) => {
  if (adminId === targetUserId) {
    throw new Error('Không thể tự xóa tài khoản của chính mình!');
  }

  // Luật Admin cuối cùng
  const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (targetUser?.role === 'ADMIN') {
    const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
    if (adminCount <= 1) throw new Error('Không thể xóa Quản trị viên duy nhất của hệ thống!');
  }

  return await prisma.user.delete({
    where: { id: targetUserId }
  });
};