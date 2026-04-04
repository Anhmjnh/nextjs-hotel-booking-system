"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import RoomCard, { Room } from "../components/RoomCard";
import api from "../api";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Bọc trong setTimeout để trở thành tác vụ bất đồng bộ
    // Giúp tránh lỗi cascading renders (gọi setState đồng bộ trong useEffect)
    const timer = setTimeout(() => {
      const token = Cookies.get("token");
      if (token) {
        setIsLoggedIn(true);
      }
    }, 0);
    
    // Hàm gọi API lấy danh sách phòng
    const fetchRooms = async () => {
      try {
        const response = await api.get('/rooms');
        if (response.data && response.data.data) {
          setRooms(response.data.data); // Lấy mảng data trả về từ Backend
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách phòng:", error);
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    Cookies.remove("token"); // Xóa token
    setIsLoggedIn(false); // Cập nhật lại trạng thái
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- THANH ĐIỀU HƯỚNG (NAVBAR) --- */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-extrabold text-blue-600 tracking-tight">
            <Link href="/">BookingHotel</Link>
          </div>
          <div className="space-x-4 flex items-center">
            {isLoggedIn ? (
              <>
                <span className="text-gray-700 font-medium hidden sm:inline">Xin chào!</span>
                <button onClick={handleLogout} className="bg-red-50 text-red-600 px-5 py-2.5 rounded-lg font-medium hover:bg-red-100 transition shadow-sm">
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium transition">
                  Đăng nhập
                </Link>
                <Link href="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition shadow-md">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* --- PHẦN BANNER CHÍNH (HERO SECTION) --- */}
      <section className="relative bg-blue-700 text-white py-28 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        {/* Ảnh nền có lớp phủ mờ */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
            Tìm Khách Sạn Hoàn Hảo Của Bạn
          </h1>
          <p className="text-lg sm:text-xl mb-10 text-blue-100 max-w-2xl mx-auto">
            Hơn 10,000+ phòng khách sạn cao cấp đang chờ đón bạn với mức giá ưu đãi nhất. Đặt phòng ngay hôm nay!
          </p>
          
          {/* Thanh tìm kiếm mô phỏng */}
          <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between mx-auto space-y-2 sm:space-y-0 text-gray-800">
            <input type="text" placeholder="Bạn muốn đi đâu?" className="w-full sm:w-1/3 px-6 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 transition" />
            <div className="hidden sm:block w-px h-10 bg-gray-200"></div>
            <input type="date" className="w-full sm:w-1/4 px-6 py-3.5 rounded-xl outline-none text-gray-500 hover:bg-gray-50 transition cursor-pointer" />
            <div className="hidden sm:block w-px h-10 bg-gray-200"></div>
            <button className="w-full sm:w-auto bg-blue-600 text-white px-10 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-md">
              Tìm kiếm
            </button>
          </div>
        </div>
      </section>

      {/* --- DANH SÁCH PHÒNG NỔI BẬT (TẠM THỜI CODE CỨNG GIAO DIỆN) --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Khám Phá Phòng Nổi Bật</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Tận hưởng không gian lưu trú tuyệt vời với các phòng được đánh giá cao nhất từ khách hàng của chúng tôi.</p>
        </div>
        
        {loadingRooms ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : rooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-xl font-medium mb-2">Hiện tại chưa có phòng nào trên hệ thống.</p>
            <p className="text-sm">Vui lòng quay lại sau hoặc liên hệ Admin.</p>
          </div>
        )}
      </section>
    </div>
  );
}