import prisma from '../config/prisma';
import bcrypt from 'bcrypt';

export const getDashboardStats = async () => {
  // 1. Đếm số lượng
  const totalUsers = await prisma.user.count({ where: { role: 'USER' } });
  const totalRooms = await prisma.room.count();
  const totalBookings = await prisma.booking.count();

  // 2. Tính tổng doanh thu (Tính cả đơn Đã Xác nhận và Đã Hoàn thành)
  const confirmedBookings = await prisma.booking.findMany({
    where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
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
      room: { select: { name: true } },
      payment: true // Kéo thêm dữ liệu thanh toán
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const updateBookingStatus = async (bookingId: number, status: any) => {
  const booking = await prisma.booking.findUnique({ 
    where: { id: bookingId },
    include: { payment: true }
  });
  if (!booking) throw new Error('Không tìm thấy đơn đặt phòng!');

  if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
    throw new Error('Đơn đã Hoàn thành hoặc Đã hủy thì không thể thay đổi trạng thái nữa!');
  }

  // Logic thanh toán: Nếu đơn Tiền mặt được Xác nhận hoặc Hoàn thành -> Tự động ghi nhận đã thu tiền
  if (booking.paymentMethod === 'CASH' && (status === 'CONFIRMED' || status === 'COMPLETED')) {
    if (!booking.payment) {
      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          amount: booking.totalPrice,
          status: 'PAID',
          paymentDate: new Date()
        }
      });
    } else if (booking.payment.status !== 'PAID') {
      await prisma.payment.update({
        where: { id: booking.payment.id },
        data: { status: 'PAID', paymentDate: new Date() }
      });
    }
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
      isLocked: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const createUser = async (adminId: number, data: any) => {
  const { email, password, name, phone, role } = data;
  const normalizedEmail = email.trim().toLowerCase();

  // Kiểm tra xem Email đã tồn tại trong hệ thống chưa
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existingUser) {
    throw new Error('Email này đã được sử dụng trong hệ thống!');
  }

  // Mã hóa mật khẩu
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Lưu thông tin User mới xuống DB
  return await prisma.user.create({
    data: { 
      email: normalizedEmail, 
      password: hashedPassword, 
      name, 
      phone,
      role: role || 'USER'
    },
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
      
      if (!targetUser.password) throw new Error("Quản trị viên này đăng nhập bằng Google nên không có mật khẩu cũ để kiểm tra!");

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

export const toggleUserLock = async (adminId: number, targetUserId: number) => {
  if (adminId === targetUserId) {
    throw new Error('Không thể tự khóa tài khoản của chính mình!');
  }

  const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!targetUser) {
    throw new Error('Không tìm thấy người dùng!');
  }

  // Luật Admin cuối cùng: Không cho khóa Admin cuối cùng còn hoạt động
  if (targetUser.role === 'ADMIN' && targetUser.isLocked === false) {
    const activeAdminCount = await prisma.user.count({ where: { role: 'ADMIN', isLocked: false } });
    if (activeAdminCount <= 1) {
      throw new Error('Không thể khóa Quản trị viên duy nhất của hệ thống!');
    }
  }

  return await prisma.user.update({
    where: { id: targetUserId },
    data: { isLocked: !targetUser.isLocked },
  });
};

// --- QUẢN LÝ LIÊN HỆ (ADMIN) ---
export const getAdminContacts = async () => {
  return await prisma.contact.findMany({
    orderBy: { createdAt: 'desc' }
  });
};

export const updateContactStatus = async (contactId: number, data: any) => {
  return await prisma.contact.update({
    where: { id: contactId },
    data
  });
};

export const deleteContact = async (contactId: number) => {
  return await prisma.contact.delete({
    where: { id: contactId }
  });
};