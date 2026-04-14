import prisma from '../config/prisma';

export const createBooking = async (userId: string | number, data: any) => {
  const { roomId, checkInDate, checkOutDate, specialRequest, paymentMethod, offerCode, guestName, guestPhone, guestCount } = data;

  // 1. Chuyển đổi chuỗi ngày tháng sang định dạng Date
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (checkIn >= checkOut) {
    throw new Error('Ngày check-out phải sau ngày check-in!');
  }

  // 2. Kiểm tra xem phòng có tồn tại không
  const room = await prisma.room.findUnique({ where: { id: Number(roomId) } });
  if (!room) {
    throw new Error('Không tìm thấy phòng!');
  }

  if (guestCount > room.capacity) {
    throw new Error(`Phòng này chỉ chứa tối đa ${room.capacity} người!`);
  }

  // 3. Logic quan trọng: Kiểm tra xem phòng đã bị đặt trùng ngày chưa
  const overlappingBookings = await prisma.booking.findFirst({
    where: {
      roomId: Number(roomId),
      status: { not: 'CANCELLED' }, // Bỏ qua các đơn đã bị hủy
      AND: [
        { checkInDate: { lt: checkOut } },
        { checkOutDate: { gt: checkIn } }
      ]
    }
  });

  if (overlappingBookings) {
    throw new Error('Phòng đã được đặt trong khoảng thời gian này. Vui lòng chọn ngày khác!');
  }

  // 4. Tính toán số ngày ở và tổng tiền
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  let totalPrice = totalDays * room.pricePerNight;

  let appliedCode = null;
  let discountAmount = 0;

  // 4.1. Xử lý mã giảm giá
  if (offerCode) {
    const offer = await prisma.offer.findUnique({ where: { code: offerCode } });
    if (!offer) throw new Error('Mã giảm giá không tồn tại!');
    
    const now = new Date();
    if (now < offer.startDate || now > offer.endDate) throw new Error('Mã giảm giá đã hết hạn!');
    if (offer.minOrderValue && totalPrice < offer.minOrderValue) throw new Error(`Đơn chưa đạt tối thiểu ${offer.minOrderValue.toLocaleString()}đ`);

    if (offer.discountType === 'FIXED') {
      discountAmount = offer.discountValue;
    } else {
      discountAmount = (totalPrice * offer.discountValue) / 100;
      if (offer.maxDiscount && discountAmount > offer.maxDiscount) discountAmount = offer.maxDiscount;
    }

    if (discountAmount > totalPrice) discountAmount = totalPrice;
    totalPrice -= discountAmount;
    appliedCode = offer.code;
  }

  // 4.2. Chọn hình thức thanh toán
  const method = paymentMethod === 'CASH' ? 'CASH' : 'ONLINE';

  // 5. Lưu Booking mới xuống Database
  return await prisma.booking.create({
    data: { userId: Number(userId), roomId: Number(roomId), checkInDate: checkIn, checkOutDate: checkOut, totalDays, totalPrice, specialRequest, paymentMethod: method, appliedCode, discountAmount, guestName, guestPhone, guestCount: Number(guestCount) || 1 },
    include: { user: true, room: true } // Lấy kèm thông tin để gửi Email
  });
};

export const getUserBookings = async (userId: string | number) => {
  // Lấy lịch sử đặt phòng của user, kèm theo thông tin của căn phòng đó
  return await prisma.booking.findMany({
    where: { userId: Number(userId) },
    include: {
      room: { select: { name: true, images: true } },
      payment: true // Kéo thêm dữ liệu thanh toán cho user
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const cancelBooking = async (userId: string | number, bookingId: string | number) => {
  const booking = await prisma.booking.findUnique({ where: { id: Number(bookingId) } });

  if (!booking) throw new Error('Không tìm thấy đơn đặt phòng!');
  if (booking.userId !== Number(userId)) throw new Error('Bạn không có quyền hủy đơn này!');
  if (booking.status !== 'PENDING') throw new Error('Chỉ có thể hủy đơn đang chờ thanh toán!');

  return await prisma.booking.update({
    where: { id: Number(bookingId) },
    data: { status: 'CANCELLED' }
  });
};