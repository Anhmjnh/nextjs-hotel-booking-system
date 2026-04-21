import nodemailer from 'nodemailer';

export const sendBookingConfirmationEmail = async (booking: any) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const paymentMethodText = booking.paymentMethod === 'ONLINE' ? 'Thanh toán trực tuyến (Đã hoàn tất)' : 'Thanh toán tiền mặt tại quầy (Chưa thanh toán)';

  await transporter.sendMail({
    from: `"Booking Hotel" <${process.env.EMAIL_USER}>`,
    to: booking.user.email,
    subject: 'Xác nhận đặt phòng thành công - Booking Hotel',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2563eb;">Xác nhận đặt phòng thành công!</h2>
        <p>Chào <b>${booking.user.name}</b>,</p>
        <p>Cảm ơn bạn đã lựa chọn Booking Hotel. Đơn đặt phòng của bạn đã được ghi nhận trên hệ thống.</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
          <h3 style="margin-top: 0; color: #1e293b; border-bottom: 1px solid #cbd5e1; padding-bottom: 10px;">Chi tiết đơn đặt phòng:</h3>
          <p><b>Phòng:</b> ${booking.room.name}</p>
          <p><b>Thời gian:</b> ${new Date(booking.checkInDate).toLocaleDateString('vi-VN')} đến ${new Date(booking.checkOutDate).toLocaleDateString('vi-VN')} (${booking.totalDays} đêm)</p>
          <p><b>Phương thức thanh toán:</b> <span style="color: #ea580c; font-weight: bold;">${paymentMethodText}</span></p>
          <p style="margin-bottom: 0;"><b>Tổng tiền:</b> <span style="color: #2563eb; font-size: 18px; font-weight: black;">${booking.totalPrice.toLocaleString('vi-VN')} VNĐ</span></p>
        </div>
        <p>Chúng tôi rất mong được đón tiếp bạn. Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi.</p>
      </div>
    `
  });
};

export const sendContactEmailToAdmin = async (contact: any) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Booking Hotel" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, 
    subject: `[Liên hệ mới] ${contact.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #ea580c;">Bạn có một tin nhắn liên hệ mới!</h2>
        <p><b>Người gửi:</b> ${contact.name} (<a href="mailto:${contact.email}">${contact.email}</a>)</p>
        <p><b>Chủ đề:</b> ${contact.subject}</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 10px;">
          <p style="white-space: pre-wrap; margin: 0;">${contact.message}</p>
        </div>
      </div>
    `
  });
};