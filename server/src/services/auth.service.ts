import prisma from '../config/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export const googleLogin = async (data: { email: string, name: string, avatar: string, googleId: string }) => {
  const email = data.email.trim().toLowerCase();
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // Nếu chưa từng có tài khoản -> Tạo mới hoàn toàn
    user = await prisma.user.create({
      data: {
        email,
        name: data.name,
        avatar: data.avatar,
        googleId: data.googleId,
        role: 'USER', // Mặc định là khách hàng
      }
    });
  } else if (!user.googleId) {
    // Nếu đã có tài khoản bằng email này (đăng ký tay) -> Liên kết thêm Google vào
    user = await prisma.user.update({
      where: { email },
      data: { googleId: data.googleId, avatar: user.avatar || data.avatar }
    });
  }

  // Tạo Token đăng nhập
  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '7d' });
  return { user, token };
};

export const registerUser = async (data: any) => {
  const { password, name, phone } = data;
  const email = data.email.trim().toLowerCase(); // Loại bỏ khoảng trắng và đưa về chữ thường

  // 1. Kiểm tra xem Email đã tồn tại trong hệ thống chưa
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    throw new Error('Email này đã được sử dụng!');
  }

  // 2. Mã hóa mật khẩu (Băm mật khẩu) bằng bcrypt
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // 3. Lưu thông tin User mới xuống Database bằng Prisma
  const newUser = await prisma.user.create({
    data: { email, password: hashedPassword, name, phone },
  });

  // 4. Loại bỏ trường password trước khi trả dữ liệu về cho an toàn
  const { password: _, ...userWithoutPassword } = newUser;
  
  return userWithoutPassword;
};

export const loginUser = async (data: any) => {
  const { password } = data;
  const email = data.email.trim().toLowerCase(); // Tự động đưa về chữ thường

  // 1. Kiểm tra User có tồn tại không
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Email hoặc mật khẩu không chính xác!');
  }

  if (!user.password) {
    throw new Error('Tài khoản này được liên kết với Google. Vui lòng sử dụng Tiếp tục với Google!');
  }

  // 2. So sánh mật khẩu gửi lên với mật khẩu đã băm trong DB
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Email hoặc mật khẩu không chính xác!');
  }

  // 3. Tạo JWT Token (thẻ thông hành) sống trong 7 ngày
  const secret = process.env.JWT_SECRET || 'default_secret';
  const token = jwt.sign(
    { userId: user.id, role: user.role }, // Payload: Dữ liệu nhúng vào token
    secret,
    { expiresIn: '7d' } // Thời gian hết hạn
  );

  // 4. Loại bỏ password trước khi trả về
  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

export const getUserById = async (userId: string | number) => {
  const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
  if (!user) {
    throw new Error('Không tìm thấy người dùng!');
  }
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const updateProfile = async (userId: string | number, data: { name?: string; phone?: string; avatar?: string }) => {
  const updatedUser = await prisma.user.update({
    where: { id: Number(userId) },
    data: { name: data.name, phone: data.phone, avatar: data.avatar },
  });
  const { password: _, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

export const changePassword = async (userId: string | number, data: any) => {
  const { oldPassword, newPassword } = data;
  const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
  if (!user) throw new Error("Không tìm thấy người dùng!");

  if (!user.password) throw new Error("Tài khoản Google không có mật khẩu để đổi!");

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error("Mật khẩu hiện tại không chính xác!");

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  await prisma.user.update({
    where: { id: Number(userId) },
    data: { password: hashedPassword },
  });
  return true;
};

export const forgotPassword = async (rawEmail: string) => {
  const email = rawEmail.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Không tìm thấy người dùng với email này!');
  if (!user.password) throw new Error('Tài khoản này đăng nhập bằng Google, không thể đổi mật khẩu!');

  // Xóa tất cả các token cũ của user này để tránh spam rác DB
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

  // Tạo token ngẫu nhiên 64 ký tự
  const resetToken = crypto.randomBytes(32).toString('hex');
  // Băm token lại trước khi lưu vào DB (Đảm bảo lỡ bị lộ DB thì hacker cũng không xài được link)
  const hashToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token: hashToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // Sống trong 15 phút
    }
  });

  const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
  
  // Cấu hình Nodemailer để gửi Email thật qua Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Booking Hotel" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Yêu cầu đặt lại mật khẩu - Booking Hotel',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2563eb;">Yêu cầu đặt lại mật khẩu</h2>
        <p>Chào bạn,</p>
        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản liên kết với email này.</p>
        <p>Vui lòng click vào nút bên dưới để tạo mật khẩu mới. <b>Lưu ý: Link chỉ có hiệu lực trong vòng 15 phút.</b></p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 0;">Đặt Lại Mật Khẩu</a>
        <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email và không chia sẻ link cho bất kỳ ai.</p>
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888;">Đội ngũ hỗ trợ Booking Hotel.</p>
      </div>
    `,
  });
  
  return true; 
};

export const resetPassword = async (token: string, newPassword: string) => {
  const hashToken = crypto.createHash('sha256').update(token).digest('hex');

  const resetRecord = await prisma.passwordResetToken.findUnique({
    where: { token: hashToken },
    include: { user: true }
  });

  if (!resetRecord) throw new Error('Đường dẫn không hợp lệ hoặc đã bị thay đổi!');
  if (resetRecord.expiresAt < new Date()) {
    await prisma.passwordResetToken.delete({ where: { id: resetRecord.id } });
    throw new Error('Đường dẫn đã hết hạn (Quá 15 phút)! Vui lòng yêu cầu lại.');
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  await prisma.user.update({ where: { id: resetRecord.userId }, data: { password: hashedPassword } });
  await prisma.passwordResetToken.delete({ where: { id: resetRecord.id } }); // Dùng xong thì hủy token
  return true;
};