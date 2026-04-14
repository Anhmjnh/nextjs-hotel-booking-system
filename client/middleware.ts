import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Phân luồng cho trang Admin
  if (path.startsWith('/admin')) {
    const adminToken = request.cookies.get('admin_token')?.value || '';
    if (!adminToken) return NextResponse.redirect(new URL('/login', request.url));

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret');
      const { payload } = await jwtVerify(adminToken, secret);
      if (payload.role !== 'ADMIN') return NextResponse.redirect(new URL('/', request.url));
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Nếu mọi thứ hợp lệ, cho phép truy cập
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], // Chạy trên mọi route để bảo vệ 2 chiều
};