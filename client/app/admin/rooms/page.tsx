/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import api from "../../../api";

interface Room {
  id: number;
  name: string;
  pricePerNight: number;
  capacity: number;
  type: string;
  images: string[];
  location: string;
  isAvailable: boolean;
  createdAt: string;
}

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // State Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // State Tìm kiếm và Lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortByPrice, setSortByPrice] = useState("default");

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, statusFilter, sortByPrice]);

  const fetchRooms = async () => {
    try {
      const token = Cookies.get("admin_token");
      const response = await api.get("/admin/rooms", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.data) {
        setRooms(response.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách phòng!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa phòng này? Mọi dữ liệu liên quan sẽ bị xóa vĩnh viễn!")) return;

    try {
      const token = Cookies.get("admin_token");
      await api.delete(`/admin/rooms/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Xóa phòng thành công!");
      setRooms(rooms.filter(room => room.id !== id));
    } catch (error) {
      interface ApiError {
        response?: {
          data?: { message?: string };
        };
      }
      const err = error as ApiError;
      toast.error(err.response?.data?.message || "Xóa phòng thất bại!");
    }
  };

  // Logic Lọc dữ liệu
  const sortedAndFilteredRooms = rooms
    .filter(room => {
      const matchSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = typeFilter === "all" || room.type === typeFilter;
      const matchStatus = statusFilter === "all" || (statusFilter === "available" ? room.isAvailable : !room.isAvailable);
      return matchSearch && matchType && matchStatus;
    })
    .sort((a, b) => {
      if (sortByPrice === "asc") return a.pricePerNight - b.pricePerNight;
      if (sortByPrice === "desc") return b.pricePerNight - a.pricePerNight;
      return 0;
    });

  // Logic phân trang sau khi lọc
  const totalPages = Math.ceil(sortedAndFilteredRooms.length / itemsPerPage);
  const currentRooms = sortedAndFilteredRooms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return <div className="flex justify-center items-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div>
      {/* Header của trang */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Quản lý Phòng</h1>
          <p className="text-slate-500 mt-2 font-medium">Xem, thêm, sửa, xóa thông tin phòng của khách sạn.</p>
        </div>
        <Link href="/admin/rooms/new" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/30 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Thêm phòng mới
        </Link>
      </div>

      {/* Thanh công cụ Tìm kiếm & Bộ lọc */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative md:col-span-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </span>
          <input type="text" placeholder="Tìm tên phòng..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition font-medium text-slate-700" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-700 bg-white">
          <option value="all">Loại phòng</option>
          <option value="SINGLE">Phòng Đơn (Single)</option>
          <option value="DOUBLE">Phòng Đôi (Double)</option>
          <option value="SUITE">Phòng Suite</option>
          <option value="FAMILY">Phòng Gia đình</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-700 bg-white">
          <option value="all">Trạng thái</option>
          <option value="available">Sẵn sàng</option>
          <option value="maintenance">Đang bảo trì</option>
        </select>
        <select value={sortByPrice} onChange={(e) => setSortByPrice(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-700 bg-white">
          <option value="default">Sắp xếp Giá</option>
          <option value="asc">Giá: Thấp đến Cao</option>
          <option value="desc">Giá: Cao đến Thấp</option>
        </select>
      </div>

      {/* Bảng Danh sách phòng */}
      <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Phòng</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Mức giá</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Sức chứa</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-8 py-5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {sortedAndFilteredRooms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-slate-500 font-medium">Không tìm thấy phòng phù hợp.</td>
                </tr>
              ) : (
                currentRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-slate-50/80 transition duration-200 group">
                    <td className="px-8 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-14 w-14 flex-shrink-0 bg-slate-200 rounded-xl overflow-hidden border border-slate-100">
                          <img src={room.images[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200"} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-slate-900 mb-0.5">{room.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md">{room.type}</span>
                            <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md flex items-center"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>{room.location}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-900">{room.pricePerNight.toLocaleString('vi-VN')} ₫</div>
                      <div className="text-xs text-slate-500 font-medium">/ đêm</div>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-slate-700">
                      {room.capacity} Người
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${room.isAvailable ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {room.isAvailable ? 'Sẵn sàng' : 'Đang bảo trì'}
                      </span>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/*  */}
                        <Link href={`/admin/rooms/${room.id}`} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        </Link>
                        {/*  */}
                        <button onClick={() => handleDelete(room.id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="px-8 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-sm text-slate-500 font-medium">Trang {currentPage} / {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 transition">Trước</button>
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 transition">Sau</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}