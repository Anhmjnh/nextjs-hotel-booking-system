/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import api from "../../../../api";

export default function AddEditRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;
  const isEditMode = roomId !== "new";

  const [loading, setLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "SINGLE",
    location: "TP. Hồ Chí Minh",
    pricePerNight: 0,
    capacity: 1,
    description: "",
    amenities: "", // Chuỗi cách nhau bằng dấu phẩy
    isAvailable: true,
    images: [] as string[],
  });

  useEffect(() => {
    if (isEditMode) {
      fetchRoomDetails();
    }
  }, [isEditMode]);

  const fetchRoomDetails = async () => {
    try {
      const token = Cookies.get("token");
      const res = await api.get(`/admin/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const r = res.data.data;
      setFormData({
        name: r.name,
        type: r.type,
        location: r.location || "TP. Hồ Chí Minh",
        pricePerNight: r.pricePerNight,
        capacity: r.capacity,
        description: r.description,
        amenities: r.amenities.join(", "),
        isAvailable: r.isAvailable,
        images: r.images,
      });
    } catch (error) {
      toast.error("Không thể lấy thông tin phòng!");
      router.push("/admin/rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    const uploadToast = toast.loading(`Đang tải lên ${files.length} ảnh...`);

    try {
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("upload_preset", "booking_hotel");

        // Sử dụng chung Cloudinary với Avatar
        const res = await fetch("https://api.cloudinary.com/v1_1/dp42o9sek/image/upload", {
          method: "POST",
          body: uploadData,
        });
        const data = await res.json();
        if (data.secure_url) uploadedUrls.push(data.secure_url);
      }

      setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
      toast.success("Tải ảnh lên thành công!", { id: uploadToast });
    } catch (error) {
      toast.error("Tải ảnh thất bại! Vui lòng thử lại.", { id: uploadToast });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Tiền xử lý dữ liệu trước khi gửi cho Prisma
    const payload = {
      ...formData,
      pricePerNight: Number(formData.pricePerNight),
      capacity: Number(formData.capacity),
      amenities: formData.amenities.split(",").map(item => item.trim()).filter(item => item !== ""),
    };

    try {
      const token = Cookies.get("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (isEditMode) {
        await api.put(`/admin/rooms/${roomId}`, payload, config);
        toast.success("Cập nhật phòng thành công!");
      } else {
        await api.post("/admin/rooms", payload, config);
        toast.success("Thêm phòng mới thành công!");
      }
      router.push("/admin/rooms");
    } catch (error) {
      interface ApiError {
        response?: {
          data?: { message?: string };
        };
      }
      const err = error as ApiError;
      toast.error(err.response?.data?.message || "Có lỗi xảy ra khi lưu dữ liệu!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/rooms" className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-500 hover:text-blue-600 transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{isEditMode ? "Sửa thông tin Phòng" : "Thêm Phòng mới"}</h1>
          <p className="text-slate-500 mt-1 font-medium">Điền đầy đủ thông tin để {isEditMode ? "cập nhật" : "đăng tải"} phòng lên hệ thống.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Tên phòng *</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" placeholder="VD: Phòng Tổng Thống Landmark..." />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Loại phòng *</label>
            <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-white">
              <option value="SINGLE">Phòng Đơn (Single)</option>
              <option value="DOUBLE">Phòng Đôi (Double)</option>
              <option value="SUITE">Phòng Suite Cao Cấp</option>
              <option value="FAMILY">Phòng Gia Đình</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Vị trí (Tỉnh/Thành phố) *</label>
            <input list="admin-locations" type="text" name="location" required value={formData.location} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" placeholder="Chọn hoặc gõ tên tỉnh/thành phố..." />
            <datalist id="admin-locations">
              <option value="TP. Hồ Chí Minh" />
              <option value="Hà Nội" />
              <option value="Đà Nẵng" />
              <option value="Nha Trang" />
              <option value="Vũng Tàu" />
              <option value="Đà Lạt" />
              <option value="Phú Quốc" />
              <option value="Hội An" />
              <option value="Hạ Long" />
              <option value="Sa Pa" />
              <option value="Quy Nhơn" />
              <option value="Phan Thiết" />
              <option value="Cần Thơ" />
              <option value="Hải Phòng" />
              <option value="Huế" />
            </datalist>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Giá mỗi đêm (VNĐ) *</label>
            <input type="number" name="pricePerNight" min="0" required value={formData.pricePerNight} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Sức chứa (Số người) *</label>
            <input type="number" name="capacity" min="1" required value={formData.capacity} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Tiện nghi (Ngăn cách bằng dấu phẩy)</label>
          <input type="text" name="amenities" value={formData.amenities} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" placeholder="VD: Wifi miễn phí, Tivi 4K, Bồn tắm, Minibar..." />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Mô tả chi tiết *</label>
          <textarea name="description" rows={4} required value={formData.description} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition resize-none" placeholder="Nhập giới thiệu về phòng..."></textarea>
        </div>

        {/* Quản lý Hình ảnh (Cloudinary) */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Hình ảnh phòng (Có thể chọn nhiều ảnh)</label>
          <div className="flex flex-wrap gap-4 mb-4">
            {formData.images.map((img, index) => (
              <div key={index} className="relative w-24 h-24 rounded-xl border border-slate-200 overflow-hidden group">
                <img src={img || undefined} alt="room" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(index)} className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition">Xóa</button>
              </div>
            ))}
            <label className="w-24 h-24 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-blue-500 hover:text-blue-500 transition cursor-pointer bg-slate-50">
              {isUploading ? <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin"></div> : <><svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg><span className="text-xs font-bold">Thêm ảnh</span></>}
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <input type="checkbox" id="isAvailable" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer" />
          <label htmlFor="isAvailable" className="font-bold text-slate-700 cursor-pointer select-none">Trạng thái: Cho phép khách đặt phòng này (Sẵn sàng)</label>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end gap-4">
          <Link href="/admin/rooms" className="px-8 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition">Hủy bỏ</Link>
          <button type="submit" disabled={isSubmitting || isUploading} className="px-10 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/30 disabled:opacity-50 flex items-center gap-2">
            {isSubmitting ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Đang lưu...</> : "Lưu thông tin"}
          </button>
        </div>
      </form>
    </div>
  );
}
