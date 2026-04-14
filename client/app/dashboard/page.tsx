"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import api from "../../api";

interface Booking {
  id: number;
  checkInDate: string;
  checkOutDate: string;
  totalDays: number;
  totalPrice: number;
  status: string;
  room: {
    name: string;
  };
  createdAt: string;
}

export default function UserDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // State dành cho Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Hiển thị 5 đơn đặt phòng trên mỗi trang

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để xem lịch sử đặt phòng!");
      router.push("/login");
      return;
    }

    const fetchMyBookings = async () => {
      try {
        const response = await api.get("/bookings/my-bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.data) {
          setBookings(response.data.data);
        }
      } catch (error) {
        toast.error("Không thể tải lịch sử đặt phòng");
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [router]);

  // Hàm xử lý khi bấm nút Hủy đơn
  const handleCancelBooking = async (bookingId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn đặt phòng này không?"))
      return;

    try {
      const token = Cookies.get("token");
      await api.put(
        `/bookings/${bookingId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("Đã hủy đơn đặt phòng thành công!");

      // Cập nhật lại state để giao diện thay đổi sang màu đỏ ngay lập tức
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "CANCELLED" } : b,
        ),
      );
    } catch (error) {
      interface ApiError {
        response?: {
          data?: { message?: string };
        };
      }
      const err = error as ApiError;
      toast.error(
        err.response?.data?.message || "Có lỗi xảy ra khi hủy phòng!",
      );
    }
  };

  // Logic Phân trang
  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = bookings.slice(indexOfFirstItem, indexOfLastItem);

  // Hàm chuyển trang
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#f8fafc]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <Link
            href="/profile"
            className="text-gray-500 hover:text-blue-600 font-semibold mb-4 inline-block transition"
          >
            &larr; Quay lại Hồ sơ
          </Link>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
              Lịch sử <span className="text-blue-600">chuyến đi</span>
            </h1>
            <p className="text-lg text-gray-500 font-medium">
              Quản lý và theo dõi các phòng bạn đã đặt.
            </p>
          </div>
        </div>

        <div className="bg-white shadow-xl shadow-gray-200/50 rounded-3xl border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-extrabold text-gray-500 uppercase tracking-widest">
                  Phòng Đã Đặt
                </th>
                <th className="px-8 py-5 text-left text-xs font-extrabold text-gray-500 uppercase tracking-widest">
                  Thời gian lưu trú
                </th>
                <th className="px-8 py-5 text-left text-xs font-extrabold text-gray-500 uppercase tracking-widest">
                  Tổng Thanh Toán
                </th>
                <th className="px-8 py-5 text-left text-xs font-extrabold text-gray-500 uppercase tracking-widest">
                  Trạng thái
                </th>
                <th className="px-8 py-5 text-right text-xs font-extrabold text-gray-500 uppercase tracking-widest">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-16 text-center text-gray-500 font-medium"
                  >
                    Bạn chưa có đơn đặt phòng nào. Hãy bắt đầu khám phá ngay!
                  </td>
                </tr>
              ) : (
                currentBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-blue-50/50 transition duration-200"
                  >
                    <td className="px-8 py-6 whitespace-nowrap text-base font-extrabold text-gray-900">
                      {b.room?.name || "Phòng đã xóa"}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-700">
                        {new Date(b.checkInDate).toLocaleDateString("vi-VN")}{" "}
                        <span className="text-gray-400 font-normal mx-1">
                          &rarr;
                        </span>{" "}
                        {new Date(b.checkOutDate).toLocaleDateString("vi-VN")}
                      </div>
                      <div className="text-xs text-gray-500 font-medium mt-1">
                        {b.totalDays} đêm
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-base font-black text-blue-600">
                      {b.totalPrice.toLocaleString("vi-VN")} ₫
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span
                        className={`px-4 py-1.5 inline-flex text-xs font-bold rounded-full border ${
                          b.status === "CONFIRMED" ? "bg-blue-50 text-blue-700 border-blue-200" : 
                          b.status === "COMPLETED" ? "bg-green-50 text-green-700 border-green-200" : 
                          b.status === "PENDING" ? "bg-orange-50 text-orange-700 border-orange-200" : 
                          "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {b.status === "CONFIRMED"
                          ? "Đã xác nhận"
                          : b.status === "COMPLETED"
                          ? "Đã hoàn thành"
                          : b.status === "PENDING"
                            ? "Chờ thanh toán"
                            : "Đã hủy"}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                      {b.status === "PENDING" && (
                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          className="text-red-600 hover:text-white bg-red-50 hover:bg-red-600 px-5 py-2.5 rounded-xl font-bold transition duration-300 border border-red-100 hover:border-red-600"
                        >
                          Hủy đơn
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Nút Điều hướng Phân trang */}
          {totalPages > 1 && (
            <div className="px-8 py-6 border-t border-gray-100 bg-gray-50 flex justify-center items-center gap-2 sm:gap-3">
              <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
              >
                &larr; Trước
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button key={index} onClick={() => handlePageChange(index + 1)} className={`w-10 h-10 rounded-xl font-bold transition flex items-center justify-center shadow-sm ${currentPage === index + 1 ? "bg-blue-600 text-white border-transparent" : "text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-blue-600"}`}>
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
              >
                Sau &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
