/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import axios from "axios";
import api from "../../../api";
import { Room } from "../../../components/RoomCard";
import toast from "react-hot-toast";
import Header from "../../header/page";
import Footer from "../../footer/page";

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    id: number;
    name: string;
    avatar: string | null;
  };
}

interface User {
  id: number;
  name: string;
  role: string;
}

interface DetailedRoom extends Room {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [room, setRoom] = useState<DetailedRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // State cho "Xem thêm" và "Sửa/Xóa"
  const [visibleReviews, setVisibleReviews] = useState(6);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState({ rating: 0, comment: "" });

  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        const response = await api.get(`/rooms/${params.id}`);
        if (response.data && response.data.data) {
          setRoom(response.data.data);
        }
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải thông tin phòng!");
      } finally {
        setLoading(false);
      }
    };

    const checkLoginStatusAndUser = async () => {
      const token = Cookies.get("token");
      if (token) {
        setIsLoggedIn(true);
        try {
          // Lấy thông tin user hiện tại để check quyền sửa/xóa
          const userRes = await api.get("/auth/me");
          setCurrentUser(userRes.data.data);
        } catch (error) {
          console.error("Không thể lấy thông tin người dùng", error);
        }
      }
    };

    if (params.id) {
      fetchRoomDetail();
      checkLoginStatusAndUser();
    }
  }, [params.id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (myRating === 0) {
      toast.error("Vui lòng chọn số sao đánh giá.");
      return;
    }
    setIsSubmittingReview(true);
    try {
      const token = Cookies.get("token");
      await api.post(`/rooms/${params.id}/reviews`,
        { rating: myRating, comment: myComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Cảm ơn bạn đã gửi đánh giá!");
      const response = await api.get(`/rooms/${params.id}`);
      setRoom(response.data.data);
      setMyRating(0);
      setMyComment("");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Gửi đánh giá thất bại!");
      } else {
        toast.error("Gửi đánh giá thất bại!");
      }
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleStartEdit = (review: Review) => {
    setEditingReviewId(review.id);
    setEditingData({ rating: review.rating, comment: review.comment || "" });
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditingData({ rating: 0, comment: "" });
  };

  const handleUpdateReview = async (e: React.FormEvent, reviewId: number) => {
    e.preventDefault();
    if (editingData.rating === 0) return toast.error("Vui lòng chọn số sao.");

    try {
      const token = Cookies.get("token");
      await api.put(`/rooms/${params.id}/reviews/${reviewId}`,
        { rating: editingData.rating, comment: editingData.comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Cập nhật đánh giá thành công!");
      const response = await api.get(`/rooms/${params.id}`);
      setRoom(response.data.data);
      handleCancelEdit();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Cập nhật thất bại!");
      } else {
        toast.error("Cập nhật thất bại!");
      }
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;
    try {
      const token = Cookies.get("token");
      await api.delete(`/rooms/${params.id}/reviews/${reviewId}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Xóa đánh giá thành công!");
      const response = await api.get(`/rooms/${params.id}`);
      setRoom(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Xóa thất bại!");
      } else {
        toast.error("Xóa thất bại!");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Không tìm thấy phòng!</h1>
        <button onClick={() => router.back()} className="text-blue-600 hover:underline font-medium">Quay lại trang trước</button>
      </div>
    );
  }

  const images = room.images && room.images.length > 0 ? room.images : ["https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"];
  const mainImage = images[0];
  const smallImages = images.slice(1, 5);
  const remainingImagesCount = images.length > 5 ? images.length - 5 : 0;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-grow max-w-[1200px] mx-auto px-6 xl:px-0 py-8 w-full">
        {/* Header Thông tin cơ bản */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-[36px] font-extrabold text-slate-900 mb-3 leading-tight">{room.name}</h1>
          <div className="flex flex-wrap items-center gap-3 text-[15px] font-medium text-slate-600">
            {room.reviewCount > 0 ? (
              <span className="flex items-center gap-1.5 text-slate-900 font-bold">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                {room.averageRating} <span className="text-slate-500 underline cursor-pointer ml-1 hover:text-slate-800 transition">({room.reviewCount} đánh giá)</span>
              </span>
            ) : (
              <span className="font-bold text-slate-600 flex items-center gap-1.5">
                Chưa có đánh giá
              </span>
            )}

            <span className="flex items-center gap-1">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
              {room.location || "Đang cập nhật"}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-blue-600 font-bold bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider text-sm">{room.type}</span>
          </div>
        </div>

        {/* Lưới ảnh được fix lại bằng Grid: Fit ảnh, có ngăn cách rõ ràng */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-[20px] overflow-hidden mb-12 h-[350px] md:h-[460px]">
          {/* Cột trái: Ảnh chính */}
          <div className="relative h-full w-full group cursor-pointer bg-slate-100">
            <img src={mainImage} alt="Main cover" className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-500 ease-in-out" />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition duration-300"></div>
          </div>

          {/* Cột phải: 4 ảnh phụ được chia bằng sub-grid */}
          <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-2 h-full w-full">
            {smallImages.map((img, idx) => (
              <div key={idx} className="relative h-full w-full group cursor-pointer bg-slate-50 overflow-hidden">
                <img src={img} alt={`Room view ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-in-out" />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition duration-300"></div>

                {idx === 3 && remainingImagesCount > 0 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                    <span className="text-white text-xl font-bold tracking-wide">+{remainingImagesCount} ảnh</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bố cục 2 cột - Đã thêm items-start để fix lỗi sticky bị trôi */}
        <div className="flex flex-col lg:flex-row gap-12 relative items-start">

          {/* Cột trái: Thông tin chi tiết */}
          <div className="flex-1 space-y-10">

            {/* Giới thiệu host */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-8">
              <div>
                <h2 className="text-[22px] font-bold text-slate-900 mb-2">Toàn bộ phòng {room.type.toLowerCase()} </h2>
                <p className="text-slate-600 text-[16px]">Tối đa {room.capacity} khách • 1 phòng ngủ • 1 phòng tắm riêng</p>
              </div>

            </div>

            {/* Mô tả */}
            <div className="border-b border-slate-200 pb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Giới thiệu không gian</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line text-[16px]">{room.description}</p>
            </div>

            {/* Tiện ích */}
            <div className="border-b border-slate-200 pb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Nơi này có những gì cho bạn</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
                {room.amenities && room.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 text-slate-800 text-[16px]">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Chính sách */}
            <div className="pb-4">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Chính sách chỗ nghỉ</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <p className="font-bold text-slate-900 mb-1">Nhận phòng</p>
                  <p className="text-slate-600">Từ 14:00 - 23:00</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <p className="font-bold text-slate-900 mb-1">Trả phòng</p>
                  <p className="text-slate-600">Trước 12:00</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <p className="font-bold text-slate-900 mb-1">Hủy đặt phòng</p>
                  <p className="text-slate-600">Miễn phí trước 24h</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải: Box Đặt phòng Sticky */}
          <div className="w-full lg:w-[360px] flex-shrink-0">
            <div className="bg-white p-6 rounded-3xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] border border-slate-100 sticky top-28">
              <div className="flex items-end gap-1 mb-6">
                <span className="text-[32px] font-extrabold text-slate-900">{room.pricePerNight.toLocaleString('vi-VN')} ₫</span>
                <span className="text-slate-500 font-medium mb-2">/ đêm</span>
              </div>

              {!room.isAvailable ? (
                <div className="w-full bg-slate-100 text-slate-600 text-center py-4 rounded-xl font-bold cursor-not-allowed">
                  Hiện không có sẵn
                </div>
              ) : (
                <Link href={`/checkout/${room.id}`} className="w-full block bg-blue-600 text-white text-center py-4 rounded-xl font-bold text-[16px] hover:bg-blue-700 transition active:scale-[0.98]">
                  Tiến hành đặt phòng
                </Link>
              )}


            </div>
          </div>
        </div>

        {/* --- KHU VỰC ĐÁNH GIÁ (FULL-WIDTH) --- */}
        <div className="mt-16 pt-12 border-t border-slate-200">
          <div className="flex items-center gap-3 mb-10">
            <svg className="w-7 h-7 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <h3 className="text-[22px] font-bold text-slate-900">
              {room.reviewCount > 0 ? `${room.averageRating} sao · ${room.reviewCount} đánh giá` : 'Chưa có đánh giá'}
            </h3>
          </div>

          {room.reviewCount > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 mb-12">
                {room.reviews.slice(0, visibleReviews).map(review => (
                  <div key={review.id}>
                    {editingReviewId === review.id ? (
                      <form onSubmit={(e) => handleUpdateReview(e, review.id)} className="bg-slate-50 p-4 rounded-xl border border-blue-200">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-medium text-slate-600">Sửa đánh giá:</span>
                          <div className="flex gap-1">{[1, 2, 3, 4, 5].map(star => (<svg key={star} onClick={() => setEditingData({ ...editingData, rating: star })} className={`w-5 h-5 cursor-pointer ${star <= editingData.rating ? 'text-yellow-400' : 'text-slate-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>))}</div>
                        </div>
                        <textarea value={editingData.comment} onChange={(e) => setEditingData({ ...editingData, comment: e.target.value })} rows={2} className="w-full p-2 rounded-lg border border-slate-200 outline-none focus:border-blue-500 mb-3"></textarea>
                        <div className="flex gap-2"><button type="submit" className="px-4 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-lg">Lưu</button><button type="button" onClick={handleCancelEdit} className="px-4 py-1.5 bg-slate-200 text-slate-700 text-sm font-bold rounded-lg">Hủy</button></div>
                      </form>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <img src={review.user.avatar || `https://ui-avatars.com/api/?name=${review.user.name}&background=random`} alt={review.user.name} className="w-12 h-12 rounded-full object-cover bg-slate-200" />
                            <div>
                              <h5 className="font-bold text-slate-900 text-[16px]">{review.user.name}</h5>
                              <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span>{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span><span>·</span>
                                <div className="flex">{[1, 2, 3, 4, 5].map(star => (<svg key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-yellow-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>))}</div>
                              </div>
                            </div>
                          </div>
                          {currentUser && (currentUser.id === review.user.id || currentUser.role === 'ADMIN') && (
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleStartEdit(review)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                              <button onClick={() => handleDeleteReview(review.id)} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                            </div>
                          )}
                        </div>
                        {review.comment && <p className="text-slate-700 leading-relaxed text-[16px]">{review.comment}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {room.reviewCount > visibleReviews && (
                <div className="text-center mt-8">
                  <button onClick={() => setVisibleReviews(prev => prev + 6)} className="px-8 py-3 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition active:scale-[0.98] shadow-sm">
                    Xem thêm {Math.min(6, room.reviewCount - visibleReviews)} đánh giá
                  </button>
                </div>
              )}
            </>
          )}

          {/* Form đánh giá */}
          {isLoggedIn && (
            <div className="max-w-3xl">
              <form onSubmit={handleReviewSubmit} className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4 text-[16px]">Để lại đánh giá của bạn</h4>
                <div className="flex items-center gap-3 mb-5">
                  <span className="font-medium text-slate-600">Chất lượng:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} onClick={() => setMyRating(star)} className={`w-6 h-6 cursor-pointer transition-transform hover:scale-110 ${star <= myRating ? 'text-yellow-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                </div>
                <textarea value={myComment} onChange={(e) => setMyComment(e.target.value)} rows={3} placeholder="Chia sẻ cảm nhận của bạn về phòng này..." className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition text-[15px] resize-none mb-4 bg-white"></textarea>
                <button type="submit" disabled={isSubmittingReview} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 text-[15px]">
                  {isSubmittingReview ? "Đang gửi..." : "Gửi đánh giá"}
                </button>
              </form>
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}