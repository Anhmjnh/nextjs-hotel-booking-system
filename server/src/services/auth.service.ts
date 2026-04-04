import prisma from '../config/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (data: any) => {
  const { email, password, name, phone } = data;

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
  const { email, password } = data;

  // 1. Kiểm tra User có tồn tại không
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Email hoặc mật khẩu không chính xác!');
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