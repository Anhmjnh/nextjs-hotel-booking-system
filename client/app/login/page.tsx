"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import api from "../../api"; // Lùi 2 cấp: từ login -> app -> client để tìm file api.ts
import axios from "axios";
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

function LoginContent() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Gọi API đăng nhập sang Backend
      const response = await api.post("/auth/login", formData);
      
      const { token, user } = response.data.data;

      toast.success("Đăng nhập thành công!");
      
      // Chuyển hướng tùy theo Role (Quyền hạn)
      setTimeout(() => {
        if (user.role === "ADMIN") {
          Cookies.set("admin_token", token); // Cấp chìa khóa cho Admin
          Cookies.set("token", token);       // Cấp luôn chìa khóa User để dạo quanh trang chủ
          window.location.href = "/admin";
        } else {
          Cookies.set("token", token);
          window.location.href = "/";
        }
      }, 500); // Chờ 0.5s để người dùng kịp nhìn thấy thông báo thành công
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) 
        ? error.response?.data?.message || "Đăng nhập thất bại!" 
        : "Đăng nhập thất bại!";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logic xử lý khi click nút Google
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // 1. Lấy thông tin User từ Google
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        
        // 2. Gửi thông tin về Backend của chúng ta
        const response = await api.post("/auth/google", {
          email: userInfo.data.email,
          name: userInfo.data.name,
          avatar: userInfo.data.picture,
          googleId: userInfo.data.sub
        });

        const { token, user } = response.data.data;
        toast.success("Đăng nhập Google thành công!");
        
        setTimeout(() => {
          if (user.role === "ADMIN") {
            Cookies.set("admin_token", token);
            Cookies.set("token", token);
            window.location.href = "/admin";
          } else {
            Cookies.set("token", token);
            window.location.href = "/";
          }
        }, 500);
      } catch (error) {
        console.error("Chi tiết lỗi Google:", error);
        const errorMessage = axios.isAxiosError(error) 
          ? error.response?.data?.message || "Lỗi kết nối từ Backend!" 
          : "Xác thực Google thất bại!";
        toast.error(`Lỗi: ${errorMessage}`);
      }
    },
    onError: () => toast.error("Cửa sổ đăng nhập bị đóng!"),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      {/* Khung Đăng nhập Tối giản */}
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm m-4">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 mx-auto mb-5">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Đăng Nhập</h2>
          <p className="text-slate-500 font-medium">Chào mừng bạn trở lại với hệ thống!</p>
        </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Địa chỉ Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium" placeholder="" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-bold text-slate-700">Mật khẩu</label>
                <Link href="/forgot-password" className="text-sm font-bold text-blue-600 hover:underline transition">Quên mật khẩu?</Link>
              </div>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required className="w-full px-5 py-3.5 pr-12 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium" placeholder="" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 outline-none">
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>
            
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/30 disabled:opacity-70 flex justify-center items-center mt-2">
              {loading ? <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin"></div> : "Đăng Nhập"}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="px-4 text-sm text-slate-400 font-medium">Hoặc</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>
          
          <button type="button" onClick={() => handleGoogleLogin()} className="w-full mb-6 flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-700 py-3.5 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-400 transition shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            Tiếp tục với Google
          </button>
          
          <p className="mt-8 text-center text-slate-500 font-medium">
            Chưa có tài khoản? <Link href="/register" className="text-blue-600 font-bold hover:underline">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
  );
}

export default function LoginPage() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <LoginContent />
    </GoogleOAuthProvider>
  );
}