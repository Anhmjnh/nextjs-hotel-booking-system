"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Link from "next/link";
import api from "../../api";
import Header from "../header/page";
import Footer from "../footer/page";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để xem hồ sơ!");
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        // Gọi API lấy thông tin chi tiết của người dùng đang đăng nhập
        const response = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data && response.data.data) {
          setUser(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi tải hồ sơ:", error);
        toast.error("Không thể tải thông tin hồ sơ. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-grow pt-16 pb-24">
        <div className="max-w-[1100px] mx-auto px-8 xl:px-12">
          <div className="mb-12">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Hồ sơ cá nhân</h1>
            <p className="text-lg text-slate-500 font-medium">Quản lý thông tin tài khoản và các hoạt động đặt phòng của bạn.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cột Trái: Thông tin cá nhân */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 pb-10 border-b border-slate-100">
                <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-4xl font-black flex-shrink-0">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="text-center sm:text-left mt-2">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{user?.name || "Người dùng"}</h2>
                  <p className="text-slate-500 font-medium mb-3">{user?.email}</p>
                  <span className="inline-block px-4 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider">
                    Thành viên {user?.role || "USER"}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Họ và tên</label>
                  <input type="text" readOnly value={user?.name || ""} className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium outline-none cursor-not-allowed" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                    <input type="email" readOnly value={user?.email || ""} className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium outline-none cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Số điện thoại</label>
                    <input type="text" readOnly value={user?.phone || "Chưa cập nhật"} className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-medium outline-none cursor-not-allowed" />
                  </div>
                </div>
              </div>
            </div>

            {/* Cột Phải: Menu điều hướng */}
            <div className="space-y-6">
              {/* Nút sang Lịch sử đặt phòng */}
              <Link href="/dashboard" className="block bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all duration-300 group cursor-pointer">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">Lịch sử đặt phòng</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">Xem lại các chuyến đi, theo dõi trạng thái và quản lý đơn đặt phòng của bạn.</p>
              </Link>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Bảo mật</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">Đổi mật khẩu để bảo vệ tài khoản tốt hơn.</p>
                <button className="text-blue-600 font-bold hover:text-blue-700 hover:underline">Đổi mật khẩu &rarr;</button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
