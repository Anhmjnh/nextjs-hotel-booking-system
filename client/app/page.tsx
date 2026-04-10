"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RoomCard, { Room } from "../components/RoomCard";
import api from "../api";
import Header from "./header/page";
import Footer from "./footer/page";

export default function HomePage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const router = useRouter();

  useEffect(() => {
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
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gọi Component Header vào đây */}
      <Header />

      {/* --- PHẦN BANNER CHÍNH (HERO SECTION) --- */}
      <section className="relative bg-gray-900 text-white py-32 px-8 text-center flex flex-col items-center justify-center">
        {/* Ảnh nền tối giản, sang trọng */}
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1542314831-c6a4d1409362?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90"></div>
        
        <div className="relative max-w-5xl mx-auto w-full z-10">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight drop-shadow-lg leading-tight">
            Kỳ nghỉ trong mơ <br/><span className="text-blue-500">bắt đầu từ đây.</span>
          </h1>
          <p className="text-xl mb-12 text-gray-200 max-w-2xl mx-auto font-medium">
            Khám phá hàng ngàn không gian lưu trú sang trọng với mức giá tốt nhất cùng trải nghiệm đặt phòng mượt mà.
          </p>
          
          {/* Thanh tìm kiếm Floating Island */}
          <div className="bg-white p-3 rounded-[2rem] shadow-2xl flex items-center w-full max-w-4xl mx-auto text-gray-800 backdrop-blur-xl">
            <input type="text" placeholder="Bạn muốn đi đâu?" className="flex-1 px-6 py-4 rounded-l-full outline-none font-medium placeholder-gray-400 focus:bg-gray-50 transition" />
            <div className="w-px h-12 bg-gray-200 mx-2"></div>
            <input type="date" className="w-48 px-4 py-4 outline-none font-medium text-gray-600 cursor-pointer focus:bg-gray-50 transition" />
            <div className="w-px h-12 bg-gray-200 mx-2"></div>
            <button className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold hover:bg-blue-700 transition duration-300 shadow-md whitespace-nowrap">
              Tìm phòng ngay
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

      {/* Gọi Component Footer vào đây */}
      <Footer />
    </div>
  );
}