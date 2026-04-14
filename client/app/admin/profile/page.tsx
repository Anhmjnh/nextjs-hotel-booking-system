"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import api from "../../../api";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: string;
  createdAt: string;
}

export default function AdminProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [editData, setEditData] = useState({ name: "", phone: "" });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("admin_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.data) {
          setUser(response.data.data);
          setEditData({
            name: response.data.data.name,
            phone: response.data.data.phone || "",
          });
        }
      } catch (error) {
        toast.error("Không thể tải thông tin hồ sơ.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSaveProfile = async () => {
    if (!editData.name.trim()) return toast.error("Họ và tên không được để trống!");
    setIsSaving(true);
    try {
      const token = Cookies.get("admin_token");
      const response = await api.put("/auth/me", editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data && response.data.data) {
        setUser(response.data.data);
        setIsEditing(false);
        toast.success("Cập nhật thông tin thành công!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật thông tin!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Vui lòng chọn một tệp hình ảnh hợp lệ!");
    if (file.size > 5 * 1024 * 1024) return toast.error("Kích thước ảnh không được vượt quá 5MB!");

    setIsUploadingAvatar(true);
    const loadingToast = toast.loading("Đang tải ảnh lên...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "booking_hotel");
      const cloudinaryRes = await fetch("https://api.cloudinary.com/v1_1/dp42o9sek/image/upload", {
        method: "POST",
        body: formData,
      });
      const cloudinaryData = await cloudinaryRes.json();
      if (!cloudinaryData.secure_url) throw new Error("Lỗi upload");

      const token = Cookies.get("token");
      const response = await api.put("/auth/me", { avatar: cloudinaryData.secure_url }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.data) {
        setUser(response.data.data);
        toast.success("Cập nhật ảnh đại diện thành công!", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Tải ảnh thất bại!", { id: loadingToast });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSavePassword = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      return toast.error("Vui lòng điền đầy đủ thông tin!");
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("Mật khẩu mới không khớp!");
    }
    if (passwordData.newPassword.length < 6) {
      return toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
    }

    setIsSavingPassword(true);
    try {
      const token = Cookies.get("admin_token");
      await api.put("/auth/change-password", {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Đổi mật khẩu thành công!");
      setIsChangingPassword(false);
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      interface ApiError { response?: { data?: { message?: string } } }
      const err = error as ApiError;
      toast.error(err.response?.data?.message || "Đổi mật khẩu thất bại!");
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hồ sơ quản trị viên</h1>
        <p className="text-slate-500 mt-2 font-medium">Quản lý thông tin cá nhân và bảo mật tài khoản hệ thống.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột Trái: Thông tin cá nhân */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10 pb-10 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative group w-24 h-24 flex-shrink-0">
                <div className="w-full h-full bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-4xl font-black overflow-hidden border-2 border-white shadow-md">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0).toUpperCase() || "A"
                  )}
                </div>
                <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200">
                  {isUploadingAvatar ? (
                    <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path></svg>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={isUploadingAvatar} />
                </label>
              </div>
              <div className="text-center sm:text-left mt-2">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{user?.name || "Quản trị viên"}</h2>
                <p className="text-slate-500 font-medium mb-3">{user?.email}</p>
                <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">
                  {user?.role || "ADMIN"}
                </span>
              </div>
            </div>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full transition-colors duration-200 shadow-sm">
                Chỉnh sửa hồ sơ
              </button>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Họ và tên</label>
              <input type="text" readOnly={!isEditing} value={isEditing ? editData.name : user?.name || ""} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className={`w-full px-5 py-4 rounded-xl border border-slate-200 font-medium outline-none transition ${isEditing ? "bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-900" : "bg-slate-50 text-slate-700 cursor-not-allowed"}`} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                <input type="email" readOnly value={user?.email || ""} className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-medium outline-none cursor-not-allowed" title="Email không thể thay đổi" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Số điện thoại</label>
                <input type="text" readOnly={!isEditing} placeholder="Chưa cập nhật" value={isEditing ? editData.phone : user?.phone || ""} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} className={`w-full px-5 py-4 rounded-xl border border-slate-200 font-medium outline-none transition ${isEditing ? "bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-900" : "bg-slate-50 text-slate-700 cursor-not-allowed"}`} />
              </div>
            </div>

            {isEditing && (
              <div className="pt-6 flex items-center gap-4 justify-end">
                <button onClick={() => { setIsEditing(false); setEditData({ name: user?.name || "", phone: user?.phone || "" }); }} className="px-6 py-3 text-slate-500 hover:text-slate-700 font-bold transition">Hủy bỏ</button>
                <button onClick={handleSaveProfile} disabled={isSaving} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition disabled:bg-blue-400 disabled:shadow-none flex items-center gap-2">
                  {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Lưu thay đổi"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cột Phải: Menu điều hướng */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Bảo mật</h3>

            {!isChangingPassword ? (
              <>
                <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">Đổi mật khẩu để bảo vệ tài khoản hệ thống.</p>
                <button onClick={() => setIsChangingPassword(true)} className="text-blue-600 font-bold hover:text-blue-700 hover:underline outline-none">Đổi mật khẩu &rarr;</button>
              </>
            ) : (
              <div className="space-y-4 mt-2">
                <div className="relative"><input type={showOldPassword ? "text" : "password"} placeholder="Mật khẩu hiện tại" value={passwordData.oldPassword} onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value }) } className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-sm font-medium" /><button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 outline-none">{showOldPassword ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}</button></div>
                <div className="relative"><input type={showNewPassword ? "text" : "password"} placeholder="Mật khẩu mới" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value }) } className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-sm font-medium" /><button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 outline-none">{showNewPassword ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}</button></div>
                <div className="relative"><input type={showConfirmPassword ? "text" : "password"} placeholder="Xác nhận mật khẩu mới" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value }) } className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-sm font-medium" /><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword) } className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 outline-none">{showConfirmPassword ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}</button></div>
                <div className="flex items-center gap-3 pt-2">
                  <button onClick={() => { setIsChangingPassword(false); setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" }); setShowOldPassword(false); setShowNewPassword(false); setShowConfirmPassword(false); }} className="flex-1 py-2.5 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition">Hủy</button>
                  <button onClick={handleSavePassword} disabled={isSavingPassword} className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center">{isSavingPassword ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Lưu"}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
