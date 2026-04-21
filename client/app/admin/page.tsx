"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import api from "../../api";

interface DashboardStats {
  totalUsers: number;
  totalRooms: number;
  totalBookings: number;
  totalRevenue: number;
  monthlyRevenue: {
    month: string;
    revenue: number;
    value: number;
    amount: string;
  }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = Cookies.get("admin_token");
        const response = await api.get("/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data && response.data.data) {
          setStats(response.data.data);
        }
      } catch (error) {
        toast.error("Không thể tải dữ liệu thống kê!");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tổng quan Hệ thống</h1>
        <p className="text-slate-500 mt-2 font-medium text-lg">Theo dõi các chỉ số hoạt động quan trọng của khách sạn.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
     {/*  Doanh thu */}
   <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300">
     <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
      
       <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
         <path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
         <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 14.625v-9.75ZM8.25 9.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM18.75 9a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-.75-.75h-.008ZM4.5 9.75A.75.75 0 0 1 5.25 9h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9.75Z" clipRule="evenodd" />
         <path d="M2.25 18a.75.75 0 0 0 0 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 0 0-.75-.75H2.25Z" />
       </svg>
     </div>
     <div>
       <p className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">Tổng Doanh Thu</p>
      
       <h3 className="text-2xl font-black text-slate-900 whitespace-nowrap">
         {stats?.totalRevenue.toLocaleString('vi-VN')} ₫
       </h3>
     </div>
   </div>

        {/* Đơn đặt */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-2V2h-2v2H9V2H7v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-7 12h-4v-2h4v2zm4-4H8v-2h8v2z"/></svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">Tổng Đơn Đặt</p>
            <h3 className="text-2xl font-black text-slate-900">{stats?.totalBookings} đơn</h3>
          </div>
        </div>

        {/* Số phòng */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300">
          <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M19 7h-8v8H3V4H1v17h2v-3h18v3h2v-12a2 2 0 0 0-2-2zm-10 6V9h2v4h-2zm4 0V9h2v4h-2zm4 0V9h2v4h-2z"/></svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">Tổng Số Phòng</p>
            <h3 className="text-2xl font-black text-slate-900">{stats?.totalRooms} phòng</h3>
          </div>
        </div>

        {/* Người dùng */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300">
          <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">Khách Hàng</p>
            <h3 className="text-2xl font-black text-slate-900">{stats?.totalUsers} người</h3>
          </div>
        </div>
      </div>

      {/* Biểu đồ doanh thu  */}
      <div className="mt-10 bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Doanh thu năm {new Date().getFullYear()}</h2>
            <p className="text-slate-500 mt-1 font-medium">Thống kê tốc độ tăng trưởng theo tháng</p>
          </div>
          <select className="px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none cursor-pointer focus:ring-2 focus:ring-blue-200">
            <option>Năm {new Date().getFullYear()}</option>
          </select>
        </div>

        <div className="h-72 flex items-end justify-between gap-2 sm:gap-4 lg:gap-6 pt-4 border-b-2 border-slate-100 pb-2">
          {/* Render các cột biểu đồ bằng DỮ LIỆU  DATABASE */}
          {(stats?.monthlyRevenue || []).map((item, index) => (
            <div key={index} className="w-full flex flex-col items-center group h-full justify-end">
              <div className="relative w-full flex items-end justify-center rounded-t-lg h-full">
                <div 
                  className={`w-full transition-colors duration-300 rounded-t-xl relative cursor-pointer ${item.value > 0 ? "bg-blue-200 group-hover:bg-blue-500" : "bg-slate-100"}`}
                  style={{ height: `${Math.max(item.value, 2)}%` }} 
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                    {item.amount}
                  </div>
                </div>
              </div>
              <span className="mt-4 text-sm font-bold text-slate-400 group-hover:text-blue-600 transition-colors">{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
