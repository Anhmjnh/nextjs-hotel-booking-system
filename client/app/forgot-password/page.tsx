"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "../../api";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setIsSent(true);
      toast.success("Gửi Email thành công!");
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message || "Có lỗi xảy ra!" : "Có lỗi xảy ra!";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm m-4">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 mx-auto mb-5">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Quên Mật Khẩu</h2>
          <p className="text-slate-500 font-medium">Nhập email để nhận liên kết đặt lại mật khẩu.</p>
        </div>

        {isSent ? (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>
            <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 font-medium text-sm">
              Một email chứa liên kết đặt lại mật khẩu đã được gửi đến <b>{email}</b>.<br /><br /> Vui lòng kiểm tra hộp thư đến (hoặc thư mục Spam) của bạn.
            </div>
            <Link href="/login" className="block w-full text-slate-500 font-bold hover:text-slate-700 transition">Quay lại Đăng nhập</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Địa chỉ Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium" placeholder="" /></div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/30 disabled:opacity-70 flex justify-center items-center">{loading ? <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin"></div> : "Gửi Yêu Cầu"}</button>
            <p className="mt-8 text-center text-slate-500 font-medium">Nhớ mật khẩu? <Link href="/login" className="text-blue-600 font-bold hover:underline">Đăng nhập</Link></p>
          </form>
        )}
      </div>
    </div>
  );
}
