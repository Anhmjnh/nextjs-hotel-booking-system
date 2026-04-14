/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../../api"; // Lùi 3 cấp để ra thư mục client
import { Room } from "../../../components/RoomCard";
import toast from "react-hot-toast";

export default function RoomDetailPage() {
  const params = useParams(); // Lấy ID phòng từ URL
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        // Gọi API Backend để lấy chi tiết 1 phòng theo ID
        const response = await api.get(`/rooms/${params.id}`);
        if (response.data && response.data.data) {
          setRoom(response.data.data);
        }
      } catch (error) {
        toast.error("Không thể tải thông tin phòng!");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchRoomDetail();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy phòng!</h1>
        <button onClick={() => router.back()} className="text-blue-600 hover:underline font-medium">Quay lại trang trước</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Thanh Header Đơn giản */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <button onClick={() => router.back()} className="flex items-center text-gray-600 hover:text-blue-600 transition font-medium">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Quay lại
          </button>
        </div>
      </header>

      {/* Nội dung chính */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Khu vực ảnh */}
          <div className="h-[400px] md:h-[500px] w-full relative bg-gray-200">
            <img 
              src={room.images && room.images.length > 0 ? room.images[0] : "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"} 
              alt={room.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-gray-800 shadow tracking-wider uppercase">
              {room.type}
            </div>
          </div>

          {/* Thông tin phòng & Đặt phòng */}
          <div className="p-6 md:p-10 flex flex-col md:flex-row gap-10">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{room.name}</h1>
              
              <div className="flex items-center text-gray-600 mb-6 space-x-6">
                <span className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 font-medium">
                  <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {room.location || "Đang cập nhật"}
                </span>
                <span className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Tối đa {room.capacity} người
                </span>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Mô tả phòng</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{room.description}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Tiện ích</h3>
                <div className="flex flex-wrap gap-3">
                  {room.amenities && room.amenities.map((amenity, index) => (
                    <span key={index} className="bg-blue-50 text-blue-700 border border-blue-100 px-4 py-2 rounded-xl text-sm font-medium">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Cột hiển thị Giá & Nút Đặt phòng */}
            <div className="w-full md:w-[350px]">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 sticky top-24">
                <p className="text-gray-500 font-medium mb-1">Giá mỗi đêm</p>
                <div className="text-3xl font-black text-blue-600 mb-6">
                  {room.pricePerNight.toLocaleString('vi-VN')}đ
                </div>

                {!room.isAvailable ? (
                  <div className="w-full bg-red-100 text-red-600 text-center py-3.5 rounded-xl font-bold">
                    Phòng đã kín
                  </div>
                ) : (
                  <Link href={`/checkout/${room.id}`} className="w-full bg-blue-600 text-white flex justify-center py-3.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-md">
                    Tiến hành đặt phòng
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}