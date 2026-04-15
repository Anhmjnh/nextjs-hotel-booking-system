"use client";

import { useState, useEffect } from "react";
import Header from "../header/page";
import Footer from "../footer/page";
import toast from "react-hot-toast";
import api from "../../api";

export interface Offer {
  id: number;
  title: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue: number | null;
  maxDiscount: number | null;
  startDate: string;
  endDate: string;
  image: string;
  color: string;
}

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Gọi API lấy danh sách ưu đãi từ Backend
    const fetchOffers = async () => {
      try {
        const response = await api.get("/offers");
        if (response.data && response.data.data) {
          setOffers(response.data.data);
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách ưu đãi:", err);
        setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau!");
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  // Hàm xử lý Copy mã giảm giá vào Clipboard
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Đã sao chép mã: ${code}`, {
      style: { borderRadius: "10px", background: "#333", color: "#fff" },
    });

    // Reset trạng thái nút copy sau 3 giây
    setTimeout(() => setCopiedCode(null), 3000);
  };

  // Hàm render mô tả dựa trên logic giảm giá
  const renderOfferDescription = (offer: Offer) => {
    let text = `Giảm ${offer.discountType === 'PERCENTAGE' ? `${offer.discountValue}%` : `${offer.discountValue.toLocaleString('vi-VN')}đ`}`;
    if (offer.discountType === 'PERCENTAGE' && offer.maxDiscount) {
      text += ` (tối đa ${offer.maxDiscount.toLocaleString('vi-VN')}đ)`;
    }
    if (offer.minOrderValue) {
      text += ` cho đơn từ ${offer.minOrderValue.toLocaleString('vi-VN')}đ.`;
    }
    return text;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Header />

      <main className="flex-grow pt-16 pb-24">
        <div className="max-w-[1400px] mx-auto px-8 xl:px-12">
          <div className="mb-14 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
              Ưu đãi <span className="text-blue-600">Độc Quyền</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium">
              Săn ngay những mã giảm giá cực hot và tận hưởng chuyến đi của bạn
              với mức chi phí tiết kiệm nhất. Số lượng ưu đãi có hạn, đặt phòng
              ngay hôm nay!
            </p>
          </div>

          {loading ? (
            /* Skeleton Loading xịn sò thay thế */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((skeleton) => (
                <div
                  key={skeleton}
                  className="bg-white rounded-3xl overflow-hidden flex flex-col sm:flex-row shadow-sm border border-slate-100 animate-pulse"
                >
                  <div className="w-full sm:w-2/5 h-48 sm:h-auto bg-slate-200"></div>
                  <div className="w-full sm:w-3/5 p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <div className="h-6 w-24 bg-slate-200 rounded-full mb-4"></div>
                      <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-slate-200 rounded w-5/6 mb-6"></div>
                    </div>
                    <div className="h-12 bg-slate-200 rounded-xl w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            /* Trạng thái lỗi nếu Backend chưa có API này */
            <div className="text-center py-24 bg-red-50/50 rounded-3xl shadow-sm border border-red-100">
              <p className="text-2xl font-bold text-red-600 mb-3">
                Đã xảy ra sự cố!{" "}
              </p>
              <p className="text-red-500 font-medium mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition shadow-lg shadow-red-600/20"
              >
                Tải lại trang
              </button>
            </div>
          ) : offers.length === 0 ? (
            /* Trạng thái Database chưa có ưu đãi nào */
            <div className="text-center py-32 bg-white rounded-3xl shadow-sm border border-slate-100">
              <p className="text-2xl font-bold text-slate-800 mb-2">
                Chưa có ưu đãi nào.
              </p>
              <p className="text-slate-500 font-medium">
                Hệ thống đang cập nhật thêm các chương trình khuyến mãi. Vui
                lòng quay lại sau.
              </p>
            </div>
          ) : (
            /* Lưới danh sách Ưu đãi thật từ DB */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-white rounded-3xl overflow-hidden flex flex-col sm:flex-row shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group"
                >
                  <div className="w-full sm:w-2/5 h-48 sm:h-auto relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="w-full sm:w-3/5 p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <span
                        className={`inline-block px-3 py-1 text-xs font-bold rounded-full border mb-4 ${offer.color || "bg-blue-50 text-blue-700 border-blue-200"}`}
                      >
                        Từ {new Date(offer.startDate).toLocaleDateString('vi-VN')} - {new Date(offer.endDate).toLocaleDateString('vi-VN')}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug">
                        {offer.title}
                      </h3>
                      <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-3">
                        {renderOfferDescription(offer)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 border-2 border-dashed border-slate-300 bg-slate-50 text-center py-2.5 rounded-xl font-mono font-bold text-slate-700 tracking-wider text-lg">
                        {offer.code}
                      </div>
                      <button
                        onClick={() => handleCopyCode(offer.code)}
                        className={`px-5 py-3 rounded-xl font-bold transition-all shadow-sm active:scale-95 flex items-center gap-2 ${copiedCode === offer.code ? "bg-green-500 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                      >
                        {copiedCode === offer.code ? "Đã Copy ✓" : "Copy Mã"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
