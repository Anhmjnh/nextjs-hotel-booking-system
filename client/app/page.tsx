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
  
  const popularLocations = [
    "TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Nha Trang", "Vũng Tàu", "Đà Lạt", "Phú Quốc", "Hội An", "Hạ Long", "Sa Pa", "Quy Nhơn", "Phan Thiết", "Cần Thơ", "Hải Phòng", "Huế"
  ];

  const [searchData, setSearchData] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: 1
  });
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

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

  const handleSearch = () => {
    // Lưu ngày vào bộ nhớ tạm để trang Checkout tự động lấy ra dùng
    if (searchData.checkIn && searchData.checkOut) {
      localStorage.setItem("booking_dates", JSON.stringify({ checkIn: searchData.checkIn, checkOut: searchData.checkOut }));
    }
    
    // Chuyển hướng và truyền dữ liệu lên thanh URL (URL Syncing)
    router.push(`/hotels?location=${searchData.location}&checkIn=${searchData.checkIn}&checkOut=${searchData.checkOut}&guests=${searchData.guests}`);
  };

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
          <div className="bg-white p-3 rounded-[2rem] shadow-2xl flex flex-col lg:flex-row items-center w-full max-w-5xl mx-auto text-gray-800 backdrop-blur-xl gap-2 relative z-20">
            
            {/* Vị trí */}
            <div className="flex-1 w-full flex items-center px-6 py-3 hover:bg-gray-50 rounded-full transition relative">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <div className="ml-4 flex-1 text-left">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Địa điểm</p>
                <input 
                  type="text" 
                  placeholder="Bạn muốn đi đâu?" 
                  value={searchData.location} 
                  onChange={(e) => {
                    setSearchData({...searchData, location: e.target.value});
                    setShowLocationDropdown(true);
                  }} 
                  onFocus={() => setShowLocationDropdown(true)}
                  onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)}
                  className="w-full bg-transparent outline-none font-bold text-gray-900 placeholder-gray-400" 
                />

                {/* Giao diện Dropdown Tùy chỉnh Cao cấp */}
                {showLocationDropdown && (
                  <div className="absolute top-[120%] left-0 w-full md:w-[120%] bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50 py-4 px-2">
                    <p className="text-xs font-bold text-gray-400 px-4 mb-2 uppercase tracking-wider">Địa điểm phổ biến</p>
                    <div className="max-h-64 overflow-y-auto">
                      {popularLocations
                        .filter(loc => loc.toLowerCase().includes(searchData.location.toLowerCase()))
                        .map((loc, idx) => (
                          <div key={idx} onClick={() => { setSearchData({...searchData, location: loc}); setShowLocationDropdown(false); }} className="flex items-center px-4 py-3 hover:bg-blue-50 cursor-pointer rounded-2xl transition mx-2 group">
                            <div className="w-10 h-10 bg-gray-100 group-hover:bg-white group-hover:text-blue-600 rounded-xl flex items-center justify-center mr-4 text-gray-500 transition shadow-sm">
                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </div>
                            <span className="font-bold text-gray-700 group-hover:text-blue-700 transition">{loc}</span>
                          </div>
                      ))}
                      {popularLocations.filter(loc => loc.toLowerCase().includes(searchData.location.toLowerCase())).length === 0 && (
                        <div className="px-6 py-4 text-sm text-gray-500 font-medium">Không tìm thấy địa điểm đề xuất. Hệ thống vẫn sẽ tìm theo từ khóa của bạn!</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="hidden lg:block w-px h-12 bg-gray-200"></div>
            
            {/* Check-in & Check-out */}
            <div className="w-full lg:w-auto flex items-center px-6 py-3 hover:bg-gray-50 rounded-full transition">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <div className="ml-4 text-left flex items-center gap-2">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Nhận phòng</p>
                  <input type="date" value={searchData.checkIn} onChange={(e) => setSearchData({...searchData, checkIn: e.target.value})} className="bg-transparent outline-none font-bold text-gray-900 cursor-pointer w-28" />
                </div>
                <span className="text-gray-300">-</span>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Trả phòng</p>
                  <input type="date" value={searchData.checkOut} min={searchData.checkIn} onChange={(e) => setSearchData({...searchData, checkOut: e.target.value})} className="bg-transparent outline-none font-bold text-gray-900 cursor-pointer w-28" />
                </div>
              </div>
            </div>
            <div className="hidden lg:block w-px h-12 bg-gray-200"></div>

            {/* Số khách & Nút Tìm kiếm */}
            <div className="w-full lg:w-auto flex items-center justify-between px-2 py-2 pl-6 hover:bg-gray-50 rounded-full transition">
              <div className="text-left mr-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Khách</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setSearchData(prev => ({...prev, guests: Math.max(1, prev.guests - 1)}))} className="text-gray-400 hover:text-blue-600 font-black text-xl w-6">-</button>
                  <span className="font-bold text-gray-900 w-4 text-center">{searchData.guests}</span>
                  <button onClick={() => setSearchData(prev => ({...prev, guests: prev.guests + 1}))} className="text-gray-400 hover:text-blue-600 font-black text-xl w-6">+</button>
                </div>
              </div>
              <button onClick={handleSearch} className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition duration-300 shadow-lg shadow-blue-600/30 whitespace-nowrap flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                Tìm kiếm
              </button>
            </div>

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