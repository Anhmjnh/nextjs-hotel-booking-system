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
        const response = await api.get('/rooms/top-choices');
        if (response.data && response.data.data) {
          setRooms(response.data.data);
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
    // Lưu ngày vào bộ nhớ tạm để trang Checkout tự động lấy ra 
    if (searchData.checkIn && searchData.checkOut) {
      localStorage.setItem("booking_dates", JSON.stringify({ checkIn: searchData.checkIn, checkOut: searchData.checkOut }));
    }

    // Chuyển hướng và truyền dữ liệu lên thanh URL 
    router.push(`/hotels?location=${searchData.location}&checkIn=${searchData.checkIn}&checkOut=${searchData.checkOut}&guests=${searchData.guests}`);
  };

  //  Điểm đến thịnh hành
  const destinations = [
    { name: "Đà Lạt", properties: "120+ chỗ nghỉ", image: "https://images.unsplash.com/photo-1558338475-7ac335028946?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Vũng Tàu", properties: "150+ chỗ nghỉ", image: "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?q=80&w=800&auto=format&fit=crop" },
    { name: "Nha Trang", properties: "180+ chỗ nghỉ", image: "https://images.unsplash.com/photo-1503188991764-408493f288b9?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Đà Nẵng", properties: "250+ chỗ nghỉ", image: "https://images.unsplash.com/photo-1558002890-c0b30998d1e6?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
    
      <Header />

      {/*  PHẦN BANNER CHÍNH   */}
      <section className="relative bg-gray-900 text-white py-32 px-8 text-center flex flex-col items-center justify-center">
        
        <img src="https://images.unsplash.com/photo-1561501900-3701fa6a0864?q=80&w=2070&auto=format&fit=crop" alt="Luxury hotel pool" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        <div className="relative max-w-5xl mx-auto w-full z-10">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight drop-shadow-lg leading-tight">
            Kỳ nghỉ trong mơ <br /><span className="text-blue-500">bắt đầu từ đây.</span>
          </h1>
          <p className="text-xl mb-12 text-gray-200 max-w-2xl mx-auto font-medium">
            Khám phá hàng ngàn không gian lưu trú sang trọng với mức giá tốt nhất cùng trải nghiệm đặt phòng mượt mà.
          </p>

          {/* Thanh tìm kiếm  */}
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
                    setSearchData({ ...searchData, location: e.target.value });
                    setShowLocationDropdown(true);
                  }}
                  onFocus={() => setShowLocationDropdown(true)}
                  onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)}
                  className="w-full bg-transparent outline-none font-bold text-gray-900 placeholder-gray-400"
                />

                {/* Giao diện Dropdown  */}
                {showLocationDropdown && (
                  <div className="absolute top-[120%] left-0 w-full md:w-[120%] bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50 py-4 px-2">
                    <p className="text-xs font-bold text-gray-400 px-4 mb-2 uppercase tracking-wider">Địa điểm phổ biến</p>
                    <div className="max-h-64 overflow-y-auto">
                      {popularLocations
                        .filter(loc => loc.toLowerCase().includes(searchData.location.toLowerCase()))
                        .map((loc, idx) => (
                          <div key={idx} onClick={() => { setSearchData({ ...searchData, location: loc }); setShowLocationDropdown(false); }} className="flex items-center px-4 py-3 hover:bg-blue-50 cursor-pointer rounded-2xl transition mx-2 group">
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
                  <input type="date" value={searchData.checkIn} onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })} className="bg-transparent outline-none font-bold text-gray-900 cursor-pointer w-32" />
                </div>
                <span className="text-gray-300">-</span>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Trả phòng</p>
                  <input type="date" value={searchData.checkOut} min={searchData.checkIn} onChange={(e) => setSearchData({ ...searchData, checkOut: e.target.value })} className="bg-transparent outline-none font-bold text-gray-900 cursor-pointer w-32" />
                </div>
              </div>
            </div>
            <div className="hidden lg:block w-px h-12 bg-gray-200"></div>

            {/* Số khách & Nút Tìm kiếm */}
            <div className="w-full lg:w-auto flex items-center justify-between px-2 py-2 pl-6 hover:bg-gray-50 rounded-full transition">
              <div className="text-left mr-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Khách</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setSearchData(prev => ({ ...prev, guests: Math.max(1, prev.guests - 1) }))} className="text-gray-400 hover:text-blue-600 font-black text-xl w-6">-</button>
                  <span className="font-bold text-gray-900 w-4 text-center">{searchData.guests}</span>
                  <button onClick={() => setSearchData(prev => ({ ...prev, guests: prev.guests + 1 }))} className="text-gray-400 hover:text-blue-600 font-black text-xl w-6">+</button>
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

      {/*  ĐIỂM ĐẾN THỊNH HÀNH  */}
      <section className="max-w-[1400px] mx-auto px-8 xl:px-12 py-20">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Điểm đến thịnh hành</h2>
          <p className="text-gray-500 text-lg font-medium">Khám phá các điểm đến được yêu thích nhất tại Việt Nam.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest, index) => (
            <div key={index} onClick={() => router.push(`/hotels?location=${dest.name}`)} className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
              <img src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
              <div className="absolute bottom-0 left-0 p-6 z-20 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-bold mb-1">{dest.name}</h3>
                <p className="text-sm font-medium text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">{dest.properties}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/*  DANH SÁCH PHÒNG NỔI BẬT  */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto px-8 xl:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Lựa chọn hàng đầu</h2>
              <p className="text-gray-500 text-lg font-medium max-w-2xl">Không gian lưu trú tuyệt vời với tiện nghi đẳng cấp đang chờ đón bạn.</p>
            </div>
            <Link href="/hotels" className="hidden md:flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition px-6 py-3 rounded-full hover:bg-blue-50">
              Xem tất cả <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </Link>
          </div>

          {loadingRooms ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : rooms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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

          <div className="mt-10 md:hidden flex justify-center">
            <Link href="/hotels" className="px-8 py-3.5 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-600 hover:text-white transition w-full text-center">
              Xem toàn bộ khách sạn
            </Link>
          </div>
        </div>
      </section>

      {/*  PROMO BANNER  */}
      <section className="max-w-[1400px] mx-auto px-8 xl:px-12 py-10">
        <div className="rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-900/20 relative overflow-hidden">
          <img src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070&auto=format&fit=crop" alt="Promo banner" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-black/50 to-transparent"></div>
          <div className="relative z-10 text-white max-w-xl">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Săn mã giảm giá cực khủng!</h2>
            <p className="text-blue-200 text-lg font-medium">Giảm đến 50% cho các lần đặt phòng trong tháng này. Áp dụng cho các hạng phòng cao cấp và resort ven biển.</p>
          </div>
          <Link href="/offers" className="relative z-10 whitespace-nowrap px-8 py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 hover:scale-105 transition-all shadow-xl active:scale-[0.98]">
            Khám phá ngay
          </Link>
        </div>
      </section>

      {/*  VÌ SAO CHỌN CHÚNG TÔI  */}
      <section className="bg-slate-50 py-20 border-t border-slate-200/60">
        <div className="max-w-[1400px] mx-auto px-8 xl:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-3xl text-center shadow-sm border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg></div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Thanh toán an toàn</h3>
              <p className="text-gray-500 font-medium">Hệ thống thanh toán bảo mật với mã hóa đầu cuối, hỗ trợ thẻ tín dụng và thanh toán trực tuyến.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl text-center shadow-sm border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cam kết giá tốt nhất</h3>
              <p className="text-gray-500 font-medium">Chúng tôi luôn mang đến mức giá ưu đãi nhất cùng nhiều chương trình khuyến mãi độc quyền hàng tháng.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl text-center shadow-sm border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Hỗ trợ 24/7</h3>
              <p className="text-gray-500 font-medium">Đội ngũ chăm sóc khách hàng chuyên nghiệp luôn sẵn sàng giải đáp mọi thắc mắc của bạn bất cứ lúc nào.</p>
            </div>
          </div>
        </div>
      </section>

      
      <Footer />
    </div>
  );
}