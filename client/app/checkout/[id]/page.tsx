"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "../../../api";
import axios from "axios";
import Header from "../../header/page";
import Footer from "../../footer/page";

interface Room {
  name: string;
  type: string;
  pricePerNight: number;
  images: string[];
  capacity: number;
}

export default function CheckoutPage() {
  const { id } = useParams();
  const router = useRouter();

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Data
  const [dates, setDates] = useState({ checkIn: "", checkOut: "" });
  const [specialRequest, setSpecialRequest] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const [guestInfo, setGuestInfo] = useState({ name: "", phone: "", count: 1 });

  // Discount Logic
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string, discount: number } | null>(null);

  useEffect(() => {
    // Tự động lấy Date từ localStorage (Nếu trước đó khách đã chọn trên trang chi tiết)
    const savedDates = localStorage.getItem("booking_dates");
    if (savedDates) setDates(JSON.parse(savedDates));

    const fetchInitialData = async () => {
      try {
        const [roomRes, userRes] = await Promise.all([
          api.get(`/rooms/${id}`),
          api.get("/auth/me")
        ]);
        setRoom(roomRes.data.data);
        if (userRes.data && userRes.data.data) {
          setGuestInfo({ name: userRes.data.data.name || "", phone: userRes.data.data.phone || "", count: 1 });
        }
      } catch (error) {
        toast.error("Không thể tải thông tin khởi tạo!");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [id]);

  const calculateTotalDays = () => {
    if (!dates.checkIn || !dates.checkOut) return 0;
    const diff = new Date(dates.checkOut).getTime() - new Date(dates.checkIn).getTime();
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 1);
  };

  const totalDays = calculateTotalDays();
  const originalPrice = room ? room.pricePerNight * totalDays : 0;
  const finalPrice = Math.max(originalPrice - (appliedPromo?.discount || 0), 0);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return toast.error("Vui lòng nhập mã giảm giá!");
    try {
      const response = await api.post("/bookings/validate-offer", { code: promoCode, orderValue: originalPrice });
      setAppliedPromo({ code: response.data.data.code, discount: response.data.data.discount });
      toast.success("Áp dụng mã giảm giá thành công!");
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message || "Mã giảm giá không hợp lệ!" : "Mã giảm giá không hợp lệ!";
      toast.error(errorMessage);
      setAppliedPromo(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dates.checkIn || !dates.checkOut) return toast.error("Vui lòng chọn ngày Check-in và Check-out!");

    setIsSubmitting(true);
    try {
      const response = await api.post("/bookings", {
        roomId: id,
        checkInDate: dates.checkIn,
        checkOutDate: dates.checkOut,
        specialRequest,
        paymentMethod,
        offerCode: appliedPromo?.code || undefined,
        guestName: guestInfo.name,
        guestPhone: guestInfo.phone,
        guestCount: guestInfo.count
      });

      toast.success("Hệ thống đang xử lý đơn hàng...");
      // Backend sẽ trả về checkoutUrl (Link Stripe hoặc Link Trang Success tùy theo paymentMethod)
      window.location.href = response.data.data.checkoutUrl;
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message || "Đặt phòng thất bại!" : "Đặt phòng thất bại!";
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-grow pt-10 pb-24">
        <div className="max-w-[1200px] mx-auto px-4 xl:px-0">
          <h1 className="text-3xl font-black text-slate-900 mb-8">Xác nhận Đặt phòng</h1>

          <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
            {/* Cột Trái: Điền Form */}
            <div className="lg:w-2/3 space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-5">1. Lịch trình của bạn</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Check-in</label>
                    <input type="date" required value={dates.checkIn} onChange={(e) => setDates({ ...dates, checkIn: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Check-out</label>
                    <input type="date" required value={dates.checkOut} min={dates.checkIn} onChange={(e) => setDates({ ...dates, checkOut: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-medium" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-5">2. Thông tin khách hàng</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Họ và tên người nhận phòng</label>
                    <input type="text" required value={guestInfo.name} onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-medium" placeholder="Nguyễn Văn A" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Số điện thoại liên hệ</label>
                    <input type="text" required value={guestInfo.phone} onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-medium" placeholder="0901234567" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Số lượng khách</label>
                  <div className="flex items-center gap-4">
                    <button type="button" onClick={() => setGuestInfo({ ...guestInfo, count: Math.max(1, guestInfo.count - 1) })} className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center font-bold text-xl hover:bg-slate-50 transition">-</button>
                    <span className="text-xl font-black w-8 text-center">{guestInfo.count}</span>
                    <button type="button" onClick={() => setGuestInfo({ ...guestInfo, count: Math.min(room?.capacity || 10, guestInfo.count + 1) })} className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center font-bold text-xl hover:bg-slate-50 transition">+</button>
                    <span className="text-sm text-slate-500 font-medium ml-2">(Tối đa {room?.capacity} người)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-5">3. Hình thức Thanh toán</h2>
                <div className="space-y-4">
                  <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${paymentMethod === "ONLINE" ? "border-blue-500 bg-blue-50/50" : "border-slate-100 hover:border-slate-200"}`}>
                    <input type="radio" name="payment" checked={paymentMethod === "ONLINE"} onChange={() => setPaymentMethod("ONLINE")} className="w-5 h-5 accent-blue-600" />
                    <div>
                      <p className="font-bold text-slate-900">Thanh toán Online (Thẻ Visa/Mastercard)</p>
                      <p className="text-sm text-slate-500 font-medium">Bảo mật tuyệt đối qua hệ thống Stripe</p>
                    </div>
                  </label>
                  <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${paymentMethod === "CASH" ? "border-blue-500 bg-blue-50/50" : "border-slate-100 hover:border-slate-200"}`}>
                    <input type="radio" name="payment" checked={paymentMethod === "CASH"} onChange={() => setPaymentMethod("CASH")} className="w-5 h-5 accent-blue-600" />
                    <div>
                      <p className="font-bold text-slate-900">Thanh toán Tiền mặt tại Quầy</p>
                      <p className="text-sm text-slate-500 font-medium">Thanh toán khi bạn đến làm thủ tục nhận phòng</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-5">4. Yêu cầu đặc biệt</h2>
                <textarea rows={3} placeholder="VD: Tôi cần phòng tầng cao, thêm giường phụ..." value={specialRequest} onChange={(e) => setSpecialRequest(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-medium resize-none"></textarea>
              </div>
            </div>

            {/* Cột Phải: Tổng quan và Tính tiền */}
            <div className="lg:w-1/3">
              <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 sticky top-24">
                <img src={room?.images[0]} alt="Phòng" className="w-full h-40 object-cover rounded-2xl mb-4" />
                <h2 className="text-xl font-black text-slate-900 mb-1">{room?.name}</h2>
                <p className="text-sm font-bold text-blue-600 bg-blue-50 inline-block px-2.5 py-1 rounded-lg mb-6">{room?.type}</p>

                <div className="space-y-3 pb-6 border-b border-slate-100 text-sm font-medium text-slate-600">
                  <div className="flex justify-between"><p>Giá phòng / đêm</p><p className="font-bold text-slate-900">{room?.pricePerNight.toLocaleString('vi-VN')} ₫</p></div>
                  <div className="flex justify-between"><p>Số đêm ở</p><p className="font-bold text-slate-900">{totalDays} đêm</p></div>
                  <div className="flex justify-between"><p>Thành tiền</p><p className="font-bold text-slate-900">{originalPrice.toLocaleString('vi-VN')} ₫</p></div>
                </div>

                {/* Mã Giảm Giá */}
                <div className="py-6 border-b border-slate-100">
                  <label className="block text-sm font-bold text-slate-700 mb-3">Mã giảm giá / Khuyến mãi</label>
                  <div className="flex gap-2">
                    <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())} placeholder="Nhập mã" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-bold font-mono text-sm" />
                    <button type="button" onClick={handleApplyPromo} className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition whitespace-nowrap text-sm">Áp dụng</button>
                  </div>
                  {appliedPromo && (
                    <div className="mt-3 text-sm font-bold text-green-600 bg-green-50 p-3 rounded-xl border border-green-100 flex justify-between">
                      <span>Mã: {appliedPromo.code}</span>
                      <span>- {appliedPromo.discount.toLocaleString('vi-VN')} ₫</span>
                    </div>
                  )}
                </div>

                <div className="pt-6 flex justify-between items-end mb-6">
                  <p className="text-slate-900 font-bold">Tổng cộng</p>
                  <div className="text-right">
                    {appliedPromo && <p className="text-sm text-slate-400 line-through mb-1">{originalPrice.toLocaleString('vi-VN')} ₫</p>}
                    <p className="text-3xl font-black text-blue-600">{finalPrice.toLocaleString('vi-VN')} ₫</p>
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/30 disabled:opacity-70 flex justify-center items-center">
                  {isSubmitting ? <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin"></div> : (paymentMethod === "ONLINE" ? "Tiến hành Thanh toán Online" : "Xác nhận Đặt phòng (Tiền mặt)")}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}