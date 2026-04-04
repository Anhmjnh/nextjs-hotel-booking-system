/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import api from "../../../api"; // Lùi 3 cấp để lấy file cấu hình api

interface Room {
  id: number;
  name: string;
  pricePerNight: number;
  images: string[];
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  // State lưu trữ dữ liệu form
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 1. Nếu chưa có Token (Chưa đăng nhập) -> Đá về trang Login
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để tiến hành đặt phòng!");
      router.push("/login");
      return;
    }

    // 2. Lấy thông tin tóm tắt của phòng đang định đặt
    const fetchRoom = async () => {
      try {
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
    
    if (params.id) fetchRoom();
  }, [params.id, router]);

  // 3. Logic tự động tính tổng số ngày và tổng số tiền
  let totalDays = 0;
  let totalPrice = 0;
  if (checkInDate && checkOutDate && room) {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    // Chuẩn hóa giờ về 0 để đếm số ngày chính xác tuyệt đối
    checkIn.setHours(0, 0, 0, 0);
    checkOut.setHours(0, 0, 0, 0);
    
    const diffTime = checkOut.getTime() - checkIn.getTime();
    if (diffTime > 0) {
      totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      totalPrice = totalDays * room.pricePerNight;
    }
  }

  // 4. Xử lý gửi Form Đặt phòng
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalDays <= 0) {
      return toast.error("Ngày trả phòng phải sau ngày nhận phòng!");
    }

    setIsSubmitting(true);
    try {
      // Gọi API Backend để tạo bản ghi Booking
      const response = await api.post("/bookings", {
        roomId: Number(params.id),
        checkInDate,
        checkOutDate,
        specialRequest,
      });

      toast.success("Đặt phòng thành công! Đang chuyển sang cổng thanh toán...");
      
      // Lấy ID của booking vừa tạo để gửi cho Stripe
      const bookingId = response.data?.data?.id || response.data?.id;

      // Gọi API sang Backend để xin Link trang quẹt thẻ
      const paymentResponse = await api.post("/payments/create-session", { bookingId });
      if (paymentResponse.data && paymentResponse.data.checkoutUrl) {
        window.location.href = paymentResponse.data.checkoutUrl; // Chuyển hướng hẳn qua website của Stripe
      }

    } catch (error) {
      // Định nghĩa khuôn mẫu lỗi của Axios thay vì dùng chữ "any"
      interface ApiError {
        response?: {
          data?: { message?: string };
        };
      }
      
      const err = error as ApiError;
      const errMsg = err.response?.data?.message || "Có lỗi xảy ra khi đặt phòng!";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (!room) return <div className="min-h-screen flex justify-center items-center bg-gray-50 text-xl font-bold">Không tìm thấy thông tin phòng!</div>;

  // Lấy ngày hôm nay làm chuẩn để không cho phép đặt phòng trong quá khứ
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* CỘT TRÁI: FORM ĐẶT PHÒNG */}
        <div className="flex-1 p-8 md:p-10">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Thông tin đặt phòng</h2>
          <form onSubmit={handleBooking} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày nhận phòng (Check-in)</label>
                <input type="date" required min={today} value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày trả phòng (Check-out)</label>
                <input type="date" required min={checkInDate || today} value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Yêu cầu đặc biệt (Không bắt buộc)</label>
              <textarea rows={4} placeholder="Ví dụ: Cần phòng tầng cao, có nôi trẻ em..." value={specialRequest} onChange={(e) => setSpecialRequest(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"></textarea>
            </div>
            <button type="submit" disabled={isSubmitting || totalDays <= 0} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed">
              {isSubmitting ? "Đang xử lý..." : "Xác nhận Đặt phòng"}
            </button>
          </form>
        </div>

        {/* CỘT PHẢI: TÓM TẮT PHÒNG & GIÁ */}
        <div className="w-full md:w-[380px] bg-gray-50 border-l border-gray-100 p-8 md:p-10 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Tóm tắt đơn đặt</h3>
          <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 shadow-sm">
            <img src={room.images && room.images.length > 0 ? room.images[0] : "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"} alt={room.name} className="w-full h-32 object-cover rounded-lg mb-4" />
            <h4 className="font-bold text-gray-800 text-lg line-clamp-2">{room.name}</h4>
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex justify-between text-gray-600"><span>Giá mỗi đêm</span><span className="font-medium text-gray-900">{room.pricePerNight.toLocaleString('vi-VN')}đ</span></div>
            <div className="flex justify-between text-gray-600"><span>Số đêm ở</span><span className="font-medium text-gray-900">{totalDays} đêm</span></div>
            <hr className="border-gray-200 my-4" />
            <div className="flex justify-between items-center"><span className="text-gray-800 font-bold">Tổng tiền</span><span className="text-3xl font-black text-blue-600">{totalPrice.toLocaleString('vi-VN')}đ</span></div>
          </div>
        </div>

      </div>
    </div>
  );
}