"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import api from "../../../api";

interface Booking {
  id: number;
  checkInDate: string;
  checkOutDate: string;
  totalDays: number;
  totalPrice: number;
  paymentMethod: string;
  appliedCode: string | null;
  discountAmount: number;
  guestName: string | null;
  guestPhone: string | null;
  guestCount: number;
  status: string;
  specialRequest: string | null;
  createdAt: string;
  payment: {
    status: string;
    amount: number;
  } | null;
  user: {
    name: string;
    email: string;
    phone: string | null;
  };
  room: {
    name: string;
  };
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State Tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const fetchBookings = async () => {
    try {
      const token = Cookies.get("admin_token");
      const response = await api.get("/admin/bookings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.data) {
        setBookings(response.data.data);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách đơn đặt phòng!");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const token = Cookies.get("admin_token");
      await api.put(`/admin/bookings/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Cập nhật trạng thái thành công!");
      
      // Tải lại danh sách để lấy thông tin Hóa đơn (Payment) mới nhất từ DB
      fetchBookings();
    } catch (error) {
      interface ApiError {
        response?: { data?: { message?: string } };
      }
      const err = error as ApiError;
      toast.error(err.response?.data?.message || "Cập nhật thất bại!");
    }
  };

  // Logic Lọc & Phân trang
  const filteredBookings = bookings.filter(b => {
    const matchSearch = b.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (b.guestName && b.guestName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                        b.room.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });
  
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const currentBookings = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return <div className="flex justify-center items-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Quản lý Đơn đặt phòng</h1>
          <p className="text-slate-500 mt-2 font-medium">Xem danh sách khách hàng và quản lý trạng thái các đơn đặt.</p>
        </div>
      </div>

      {/* Thanh công cụ Tìm kiếm & Bộ lọc */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex-1 relative">
           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
           </span>
           <input type="text" placeholder="Tìm tên khách hàng hoặc tên phòng..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition font-medium text-slate-700" />
        </div>
        <div className="w-full md:w-64">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-700 bg-white">
            <option value="all">Tất cả trạng thái</option>
            <option value="PENDING">Chờ thanh toán</option>
            <option value="CONFIRMED">Đã xác nhận</option>
            <option value="COMPLETED">Đã hoàn thành</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Phòng & Thời gian</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng tiền</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái (Thay đổi)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {currentBookings.length === 0 ? (
                <tr><td colSpan={4} className="px-8 py-12 text-center text-slate-500 font-medium">Chưa có đơn đặt phòng nào.</td></tr>
              ) : (
                currentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition duration-200">
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-900">{b.guestName || b.user.name}</div>
                      <div className="text-sm text-slate-500 mt-1">{b.user.email}</div>
                      <div className="text-xs text-slate-400 mt-1">{b.guestPhone || b.user.phone || 'Không có SĐT'} • {b.guestCount || 1} khách</div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md inline-block mb-2">{b.room.name}</div>
                      <div className="text-sm font-medium text-slate-700">
                        {new Date(b.checkInDate).toLocaleDateString("vi-VN")} <span className="text-slate-400 mx-1">&rarr;</span> {new Date(b.checkOutDate).toLocaleDateString("vi-VN")}
                      </div>
                      {b.specialRequest && (
                        <div className="mt-2 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1.5 rounded-lg border border-orange-100 flex items-start gap-1.5 whitespace-normal w-max max-w-xs">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span className="leading-snug line-clamp-2" title={b.specialRequest}>{b.specialRequest}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm font-black text-slate-900">
                      <div>{b.totalPrice.toLocaleString('vi-VN')} ₫</div>
                      {b.discountAmount > 0 && (
                        <div className="text-xs text-green-600 font-medium mt-0.5">- {b.discountAmount.toLocaleString('vi-VN')} ₫ (Mã: {b.appliedCode})</div>
                      )}
                      {b.status === 'CANCELLED' ? (
                        <div className="mt-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md inline-block uppercase tracking-wider border border-red-200">Đã hủy đơn</div>
                      ) : b.paymentMethod === 'ONLINE' ? (
                        b.payment?.status === 'PAID' ? (
                          <div className="mt-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md inline-block uppercase tracking-wider border border-green-200">Đã TT Online</div>
                        ) : (
                          <div className="mt-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md inline-block uppercase tracking-wider border border-orange-200">Chờ TT Online</div>
                        )
                      ) : (
                        b.payment?.status === 'PAID' ? (
                          <div className="mt-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md inline-block uppercase tracking-wider border border-green-200">Đã thu Tiền mặt</div>
                        ) : (
                          <div className="mt-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md inline-block uppercase tracking-wider border border-slate-200">Chờ thu Tiền mặt</div>
                        )
                      )}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <select 
                        value={b.status} 
                        onChange={(e) => handleUpdateStatus(b.id, e.target.value)}
                        disabled={b.status === 'COMPLETED' || b.status === 'CANCELLED'}
                        className={`text-xs font-bold px-3 py-2 rounded-xl outline-none border-2 transition-colors
                          ${b.status === 'CONFIRMED' ? 'bg-blue-50 text-blue-700 border-blue-200 focus:border-blue-500' : 
                            b.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border-green-200 focus:border-green-500' : 
                            b.status === 'PENDING' ? 'bg-orange-50 text-orange-700 border-orange-200 focus:border-orange-500 cursor-pointer' : 
                            'bg-red-50 text-red-700 border-red-200'}
                          ${(b.status === 'COMPLETED' || b.status === 'CANCELLED') ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        <option value="PENDING">Chờ thanh toán</option>
                        <option value="CONFIRMED">Đã xác nhận</option>
                        <option value="COMPLETED">Hoàn thành / Check-out</option>
                        <option value="CANCELLED">Đã hủy</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
