"use client";

import { useEffect, useState } from "react";
import api from "../../api";
import RoomCard, { Room } from "../../components/RoomCard";
import Header from "../header/page";
import Footer from "../footer/page";

export default function HotelsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State dành cho Bộ lọc và Tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [capacityFilter, setCapacityFilter] = useState("all");

  // State dành cho Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 12 là con số hoàn hảo cho grid 1-2-3-4

  useEffect(() => {
    // Gọi API lấy toàn bộ danh sách phòng từ Backend
    const fetchRooms = async () => {
      try {
        const response = await api.get('/rooms');
        if (response.data && response.data.data) {
          setRooms(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách phòng:", error);
        setError("Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng và thử lại!");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Reset về trang 1 mỗi khi người dùng thay đổi Bộ lọc hoặc Tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, capacityFilter]);

  // Logic lọc và sắp xếp dữ liệu (Chạy tự động mỗi khi state thay đổi)
  const filteredRooms = rooms
    .filter((room) => room.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((room) => capacityFilter === "all" ? true : room.capacity >= parseInt(capacityFilter))
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.pricePerNight - b.pricePerNight;
      if (sortBy === "price_desc") return b.pricePerNight - a.pricePerNight;
      return 0; // Mặc định
    });

  // Logic Phân trang (Cắt mảng dữ liệu theo trang hiện tại)
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstItem, indexOfLastItem);

  // Hàm chuyển trang và tự động cuộn lên đầu mượt mà
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Kế thừa lại Header */}
      <Header />

      {/* Phần nội dung chính (Main Content) */}
      <main className="flex-grow pt-16 pb-24">
        <div className="max-w-[1400px] mx-auto px-8 xl:px-12">
          <div className="mb-14 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
              Tất cả <span className="text-blue-600">Khách sạn & Phòng</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium">Khám phá không gian lưu trú lý tưởng cho chuyến đi tiếp theo của bạn. Chúng tôi mang đến những lựa chọn chất lượng với mức giá tốt nhất.</p>
          </div>

          {/* Thanh công cụ Tìm kiếm & Bộ lọc */}
          <div className="mb-10 flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </span>
              <input type="text" placeholder="Tìm tên khách sạn, tên phòng..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition font-medium text-slate-700" />
            </div>
            
            <div className="w-full md:w-56">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition font-medium text-slate-700 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.2em_1.2em] bg-no-repeat bg-[position:right_1rem_center]">
                <option value="default">Sắp xếp: Mới nhất</option>
                <option value="price_asc">Giá: Thấp đến Cao</option>
                <option value="price_desc">Giá: Cao đến Thấp</option>
              </select>
            </div>

            <div className="w-full md:w-56">
              <select value={capacityFilter} onChange={(e) => setCapacityFilter(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition font-medium text-slate-700 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.2em_1.2em] bg-no-repeat bg-[position:right_1rem_center]">
                <option value="all">Sức chứa: Bất kỳ</option>
                <option value="1">Từ 1 Người trở lên</option>
                <option value="2">Từ 2 Người trở lên</option>
                <option value="4">Từ 4 Người trở lên</option>
                <option value="6">Dành cho Gia đình (6+)</option>
              </select>
            </div>
          </div>

          {loading ? (
            /* Skeleton Loading xịn sò thay cho Spinner */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((skeleton) => (
                <div key={skeleton} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-pulse">
                  <div className="w-full h-56 bg-slate-200"></div>
                  <div className="p-5">
                    <div className="h-5 bg-slate-200 rounded-full w-3/4 mb-3"></div>
                    <div className="flex justify-between items-center mb-4">
                      <div className="h-4 bg-slate-200 rounded-full w-1/3"></div>
                      <div className="h-4 bg-slate-200 rounded-full w-1/4"></div>
                    </div>
                    <div className="h-10 bg-slate-200 rounded-xl w-full mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            /* Trạng thái Lỗi hiển thị rõ ràng để tránh hiểu nhầm */
            <div className="text-center py-24 bg-red-50/50 rounded-3xl shadow-sm border border-red-100">
              <p className="text-2xl font-bold text-red-600 mb-3">Đã xảy ra sự cố! 😥</p>
              <p className="text-red-500 font-medium mb-6">{error}</p>
              <button onClick={() => window.location.reload()} className="px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition shadow-lg shadow-red-600/20">Tải lại trang</button>
            </div>
          ) : rooms.length === 0 ? (
            /* Trạng thái DB trống chưa có phòng nào */
            <div className="text-center py-32 bg-white rounded-3xl shadow-sm border border-slate-100">
              <p className="text-2xl font-bold text-slate-800 mb-2">Chưa có phòng nào 🏨</p>
              <p className="text-slate-500 font-medium">Hệ thống đang cập nhật thêm các phòng mới. Vui lòng quay lại sau.</p>
            </div>
          ) : filteredRooms.length > 0 ? (
            <>
              {/* Hiển thị danh sách phòng ĐÃ ĐƯỢC CẮT THEO TRANG */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {currentRooms.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>

              {/* Nút Điều hướng Phân trang */}
              {totalPages > 1 && (
                <div className="mt-14 flex justify-center items-center gap-2 sm:gap-3">
                  <button 
                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))} 
                    disabled={currentPage === 1}
                    className="px-4 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    &larr; Trước
                  </button>

                  {/* Sinh ra các nút số trang tương ứng */}
                  {[...Array(totalPages)].map((_, index) => (
                    <button key={index} onClick={() => handlePageChange(index + 1)} className={`w-11 h-11 rounded-xl font-bold transition flex items-center justify-center ${currentPage === index + 1 ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" : "text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-blue-600"}`}>
                      {index + 1}
                    </button>
                  ))}

                  <button 
                    onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))} 
                    disabled={currentPage === totalPages}
                    className="px-4 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Sau &rarr;
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Trạng thái Không tìm thấy kết quả phù hợp với Bộ lọc */
            <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-slate-100">
              <p className="text-2xl font-bold text-slate-800 mb-2">Không tìm thấy phòng phù hợp </p>
              <button onClick={() => { setSearchTerm(""); setSortBy("default"); setCapacityFilter("all"); }} className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-full hover:bg-slate-200 transition">Xóa bộ lọc</button>
            </div>
          )}
        </div>
      </main>

      {/* Kế thừa lại Footer */}
      <Footer />
    </div>
  );
}
