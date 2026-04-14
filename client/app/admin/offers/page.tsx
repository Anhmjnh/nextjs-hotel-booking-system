"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import api from "../../../api";

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

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const defaultForm = {
    title: "",
    code: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minOrderValue: "",
    maxDiscount: "",
    startDate: "",
    endDate: "",
    image: "",
    color: "bg-blue-50 text-blue-700 border-blue-200"
  };
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const token = Cookies.get("admin_token");
      const response = await api.get("/admin/offers", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.data) {
        setOffers(response.data.data);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách ưu đãi!");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const loadingToast = toast.loading("Đang tải ảnh lên...");
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", "booking_hotel");
      const res = await fetch("https://api.cloudinary.com/v1_1/dp42o9sek/image/upload", { method: "POST", body: uploadData });
      const data = await res.json();
      if (data.secure_url) {
        setFormData(prev => ({ ...prev, image: data.secure_url }));
        toast.success("Tải ảnh thành công!", { id: loadingToast });
      }
    } catch {
      toast.error("Tải ảnh thất bại!", { id: loadingToast });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) return toast.error("Vui lòng tải lên hình ảnh cho ưu đãi!");
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      return toast.error("Ngày kết thúc phải sau ngày bắt đầu!");
    }
    setIsSaving(true);
    try {
      const token = Cookies.get("admin_token");
      if (editingOffer) {
        await api.put(`/admin/offers/${editingOffer.id}`, formData, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("Cập nhật ưu đãi thành công!");
      } else {
        await api.post("/admin/offers", formData, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("Thêm mới ưu đãi thành công!");
      }
      fetchOffers();
      handleCloseModal();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu ưu đãi!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa ưu đãi này? Khách hàng sẽ không thể dùng mã này nữa!")) return;
    try {
      const token = Cookies.get("admin_token");
      await api.delete(`/admin/offers/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Xóa ưu đãi thành công!");
      setOffers(prev => prev.filter(o => o.id !== id));
    } catch {
      toast.error("Xóa ưu đãi thất bại!");
    }
  };

  const openCreateModal = () => {
    setEditingOffer(null);
    setFormData(defaultForm);
    setIsModalOpen(true);
  };

  const openEditModal = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      code: offer.code,
      discountType: offer.discountType,
      discountValue: offer.discountValue.toString(),
      minOrderValue: offer.minOrderValue ? offer.minOrderValue.toString() : "",
      maxDiscount: offer.maxDiscount ? offer.maxDiscount.toString() : "",
      startDate: offer.startDate.split('T')[0],
      endDate: offer.endDate.split('T')[0],
      image: offer.image,
      color: offer.color
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOffer(null);
    setFormData(defaultForm);
  };

  const filteredOffers = offers.filter(o => 
    o.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center items-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Quản lý Ưu đãi</h1>
          <p className="text-slate-500 mt-2 font-medium">Quản lý các mã giảm giá và chiến dịch khuyến mãi.</p>
        </div>
        <button onClick={openCreateModal} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/30 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Tạo ưu đãi mới
        </button>
      </div>

      <div className="mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4">
        <div className="flex-1 relative">
           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
           </span>
           <input type="text" placeholder="Tìm kiếm theo tiêu đề hoặc mã giảm giá..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition font-medium text-slate-700" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOffers.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 font-medium">Chưa có ưu đãi nào được tạo.</div>
        ) : (
          filteredOffers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-3xl p-6 flex flex-col sm:flex-row gap-6 shadow-sm border border-slate-100 hover:shadow-md transition">
              <div className="w-full sm:w-1/3 h-32 sm:h-auto rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md border uppercase ${offer.color}`}>
                      HSD: {new Date(offer.endDate).toLocaleDateString('vi-VN')}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(offer)} className="text-blue-600 hover:text-blue-800 p-1 bg-blue-50 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                      <button onClick={() => handleDelete(offer.id)} className="text-red-600 hover:text-red-800 p-1 bg-red-50 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">{offer.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2">
                    Giảm {offer.discountType === 'PERCENTAGE' ? `${offer.discountValue}%` : `${offer.discountValue.toLocaleString('vi-VN')}đ`}
                    {offer.minOrderValue ? ` - Đơn tối thiểu: ${offer.minOrderValue.toLocaleString('vi-VN')}đ` : ''}
                  </p>
                </div>
                <div className="mt-4 font-mono font-bold text-slate-800 bg-slate-50 py-2 text-center rounded-lg border border-slate-200 border-dashed tracking-widest">{offer.code}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Thêm/Sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{editingOffer ? "Sửa ưu đãi" : "Tạo ưu đãi mới"}</h2>
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className="block text-sm font-bold text-slate-700 mb-2">Tiêu đề *</label><input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-medium" /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2">Mã Code *</label><input type="text" required value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-bold font-mono" placeholder="VD: SUMMER2024" /></div>
                
                <div><label className="block text-sm font-bold text-slate-700 mb-2">Loại giảm giá *</label><select value={formData.discountType} onChange={(e) => setFormData({...formData, discountType: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-medium"><option value="PERCENTAGE">Theo phần trăm (%)</option><option value="FIXED">Số tiền cố định (VNĐ)</option></select></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2">Mức giảm *</label><input type="number" required min={0} value={formData.discountValue} onChange={(e) => setFormData({...formData, discountValue: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-medium" placeholder={formData.discountType === 'PERCENTAGE' ? "VD: 10" : "VD: 100000"} /></div>
                
                <div><label className="block text-sm font-bold text-slate-700 mb-2">Đơn tối thiểu (VNĐ)</label><input type="number" min={0} value={formData.minOrderValue} onChange={(e) => setFormData({...formData, minOrderValue: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-medium" placeholder="Bỏ trống nếu không yêu cầu" /></div>
                {formData.discountType === 'PERCENTAGE' ? (
                  <div><label className="block text-sm font-bold text-slate-700 mb-2">Giảm tối đa (VNĐ)</label><input type="number" min={0} value={formData.maxDiscount} onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-medium" placeholder="Bỏ trống nếu không giới hạn" /></div>
                ) : <div></div>}

                <div><label className="block text-sm font-bold text-slate-700 mb-2">Ngày bắt đầu *</label><input type="date" required value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-medium" /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2">Ngày kết thúc *</label><input type="date" required min={formData.startDate} value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-medium" /></div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Màu chủ đạo</label>
                  <select value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-medium">
                    <option value="bg-blue-50 text-blue-700 border-blue-200">Xanh dương</option>
                    <option value="bg-red-50 text-red-700 border-red-200">Đỏ</option>
                    <option value="bg-green-50 text-green-700 border-green-200">Xanh lá</option>
                    <option value="bg-orange-50 text-orange-700 border-orange-200">Cam</option>
                    <option value="bg-purple-50 text-purple-700 border-purple-200">Tím</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Hình ảnh Banner *</label>
                  {formData.image && <img src={formData.image} alt="Preview" className="h-32 object-cover rounded-xl mb-3 border border-slate-200" />}
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={handleCloseModal} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition">Hủy bỏ</button>
                <button type="submit" disabled={isSaving || isUploading} className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50">Lưu Ưu đãi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}