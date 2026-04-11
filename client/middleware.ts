import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value || '';

  let userRole = '';
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret');
      const { payload } = await jwtVerify(token, secret);
      userRole = payload.role as string;
    } catch (error) {
      // Token không hợp lệ
    }
  }

  // 1. Phân luồng cho trang Admin
  if (path.startsWith('/admin')) {
    if (!token) return NextResponse.redirect(new URL('/login', request.url));
    if (userRole !== 'ADMIN') return NextResponse.redirect(new URL('/', request.url));
  }

  // Nếu mọi thứ hợp lệ, cho phép truy cập
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], // Chạy trên mọi route để bảo vệ 2 chiều
};