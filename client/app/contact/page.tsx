"use client";

import { useState } from "react";
import Header from "../header/page";
import Footer from "../footer/page";
import toast from "react-hot-toast";
import api from "../../api";
import axios from "axios";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post("/contacts", formData);
      toast.success("Cảm ơn bạn! Lời nhắn của bạn đã được gửi thành công.", {
        style: { borderRadius: "10px", background: "#333", color: "#fff" },
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message || "Gửi tin nhắn thất bại!" : "Gửi tin nhắn thất bại!";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-grow pt-16 pb-24">
        <div className="max-w-[1200px] mx-auto px-8 xl:px-12">
          {/* Tiêu đề trang */}
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
              Liên hệ với <span className="text-blue-600">Chúng tôi</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium">
              Bạn có câu hỏi, thắc mắc hay cần hỗ trợ đặt phòng? Đừng ngần ngại để lại lời nhắn, đội ngũ hỗ trợ của Booking luôn sẵn sàng phục vụ bạn 24/7.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* CỘT TRÁI: Thông tin liên hệ */}
            <div className="w-full lg:w-5/12 space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-6 hover:shadow-md transition">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Địa chỉ</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">Đường Âu Cơ, Phường 10, Quận Tân Bình, TP.HCM</p>

                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-6 hover:shadow-md transition">
                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Hotline 24/7</h3>
                  <p className="text-slate-500 font-medium text-lg">1900 123 456</p>
                  <p className="text-slate-500 font-medium text-lg">090 123 4567</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-6 hover:shadow-md transition">
                <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Email</h3>
                  <p className="text-slate-500 font-medium text-lg">support@booking.com</p>
                  <p className="text-slate-500 font-medium text-lg">booking@support.com</p>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: Form liên hệ */}
            <div className="w-full lg:w-7/12">
              <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-8">Gửi lời nhắn cho chúng tôi</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Họ và tên *</label>
                      <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Nhập họ tên của bạn" className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition font-medium text-slate-700 bg-slate-50 focus:bg-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Email *</label>
                      <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Địa chỉ email" className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition font-medium text-slate-700 bg-slate-50 focus:bg-white" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Chủ đề *</label>
                    <input type="text" name="subject" required value={formData.subject} onChange={handleChange} placeholder="Vấn đề bạn cần hỗ trợ là gì?" className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition font-medium text-slate-700 bg-slate-50 focus:bg-white" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Nội dung lời nhắn *</label>
                    <textarea name="message" required rows={5} value={formData.message} onChange={handleChange} placeholder="Nhập nội dung chi tiết..." className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition font-medium text-slate-700 bg-slate-50 focus:bg-white resize-none"></textarea>
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 disabled:bg-slate-400 disabled:shadow-none disabled:cursor-not-allowed text-lg mt-4 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Đang gửi...</span>
                      </>
                    ) : (
                      "Gửi tin nhắn"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
