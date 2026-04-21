"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import api from "../../../api";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: string;
  isLocked: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // State Sửa thông tin
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState({ name: "", phone: "", password: "", oldPassword: "" });
  const [isSaving, setIsSaving] = useState(false);

  // State Thêm người dùng
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [addFormData, setAddFormData] = useState({ name: "", email: "", phone: "", password: "", role: "USER" });
  const [isAdding, setIsAdding] = useState(false);

  // State Tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
  
    const token = Cookies.get("admin_token");
    if (token) {
      try {
        const payloadBase64 = token.split(".")[1];
        const decoded = JSON.parse(atob(payloadBase64));
        setCurrentUserId(decoded.userId);
      } catch (e) { }
    }

    fetchUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      const token = Cookies.get("admin_token");
      const response = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.data) {
        setUsers(response.data.data);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách người dùng!");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (id: number, newRole: string) => {
    try {
      const token = Cookies.get("admin_token");
      await api.put(`/admin/users/${id}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Cập nhật phân quyền thành công!");

      // Cập nhật lại giao diện
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
    } catch (error) {
      interface ApiError {
        response?: { data?: { message?: string } };
      }
      const err = error as ApiError;
      toast.error(err.response?.data?.message || "Cập nhật thất bại!");
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này? Thao tác này không thể hoàn tác!")) return;

    try {
      const token = Cookies.get("admin_token");
      await api.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Xóa người dùng thành công!");
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (error) {
      interface ApiError {
        response?: { data?: { message?: string } };
      }
      const err = error as ApiError;
      toast.error(err.response?.data?.message || "Xóa người dùng thất bại!");
    }
  };

  const handleToggleLock = async (id: number, isCurrentlyLocked: boolean) => {
    const action = isCurrentlyLocked ? "mở khóa" : "khóa";
    if (!window.confirm(`Bạn có chắc chắn muốn ${action} tài khoản này?`)) return;

    try {
      const token = Cookies.get("admin_token");
      await api.put(`/admin/users/${id}/lock`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`${isCurrentlyLocked ? "Mở khóa" : "Khóa"} tài khoản thành công!`);

      // Cập nhật lại giao diện
      setUsers(prev => prev.map(u => u.id === id ? { ...u, isLocked: !isCurrentlyLocked } : u));
    } catch (error) {
      interface ApiError {
        response?: { data?: { message?: string } };
      }
      const err = error as ApiError;
      toast.error(err.response?.data?.message || "Thao tác thất bại!");
    }
  };

  const handleSaveUserInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    // Kiểm tra độ hợp lệ của Số điện thoại (Chỉ số, 10-11 ký tự)
    if (editFormData.phone) {
      if (!/^\d{10,11}$/.test(editFormData.phone)) {
        return toast.error("Số điện thoại không hợp lệ (Phải là 10-11 chữ số)!");
      }
    }

    // Kiểm tra độ dài mật khẩu mới
    if (editFormData.password && editFormData.password.length < 6) {
      return toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
    }

    // Yêu cầu mật khẩu cũ nếu đối tượng bị sửa là Admin
    if (editingUser.role === 'ADMIN' && editFormData.password && !editFormData.oldPassword) {
      return toast.error("Vui lòng nhập mật khẩu cũ để đổi mật khẩu Quản trị viên!");
    }

    setIsSaving(true);
    try {
      const token = Cookies.get("admin_token");
      await api.put(`/admin/users/${editingUser.id}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Cập nhật thông tin thành công!");

      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, name: editFormData.name, phone: editFormData.phone } : u));
      setEditingUser(null);
    } catch (error) {
      interface ApiError {
        response?: { data?: { message?: string } };
      }
      const err = error as ApiError;
      toast.error(err.response?.data?.message || "Cập nhật thất bại!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!addFormData.email || !addFormData.name || !addFormData.password) {
      return toast.error("Vui lòng điền đầy đủ các trường bắt buộc!");
    }

    if (addFormData.phone && !/^\d{10,11}$/.test(addFormData.phone)) {
      return toast.error("Số điện thoại không hợp lệ (Phải là 10-11 chữ số)!");
    }

    if (addFormData.password.length < 6) {
      return toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
    }

    setIsAdding(true);
    try {
      const token = Cookies.get("admin_token");
      await api.post(`/admin/users`, addFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Thêm người dùng thành công!");
      setIsAddingUser(false);
      setAddFormData({ name: "", email: "", phone: "", password: "", role: "USER" });
      fetchUsers();
    } catch (error) {
      interface ApiError {
        response?: { data?: { message?: string } };
      }
      const err = error as ApiError;
      toast.error(err.response?.data?.message || "Thêm người dùng thất bại!");
    } finally {
      setIsAdding(false);
    }
  };

  // Logic Lọc & Phân trang
  const filteredUsers = users.filter(u =>
    (roleFilter === "all" || u.role === roleFilter) &&
    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone && u.phone.includes(searchTerm)))
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return <div className="flex justify-center items-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Quản lý Người dùng</h1>
          <p className="text-slate-500 mt-2 font-medium">Xem danh sách, phân quyền và quản lý tài khoản trên hệ thống.</p>
        </div>
        <button onClick={() => setIsAddingUser(true)} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/30 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Thêm người dùng
        </button>
      </div>

      {/* Thanh công cụ Tìm kiếm & Bộ lọc */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </span>
          <input type="text" placeholder="Tìm tên, email hoặc SĐT..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition font-medium text-slate-700" />
        </div>
        <div className="w-full md:w-64">
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-700 bg-white">
            <option value="all">Tất cả vai trò</option>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Người dùng</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Liên hệ</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày tham gia</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Vai trò</th>
                <th className="px-8 py-5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {currentUsers.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-12 text-center text-slate-500 font-medium">Không tìm thấy người dùng nào.</td></tr>
              ) : (
                currentUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition duration-200 group">
                    <td className="px-8 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg overflow-hidden border border-blue-100">
                          {u.avatar ? (
                            <img src={u.avatar} alt="" className="h-full w-full object-cover" />
                          ) : (
                            u.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            {u.name}
                            {u.isLocked && <span className="px-2 py-0.5 text-xs font-bold text-red-700 bg-red-100 rounded-full">Đã khóa</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900 font-medium">{u.email}</div>
                      <div className="text-xs text-slate-500 mt-1">{u.phone || "Chưa cập nhật SĐT"}</div>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-slate-700">
                      {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap">
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                        disabled={u.id === currentUserId}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg outline-none cursor-pointer border-2 transition-colors
                          ${u.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200 focus:border-purple-500' : 'bg-slate-50 text-slate-700 border-slate-200 focus:border-slate-500'}
                          ${u.id === currentUserId ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                      {u.id === currentUserId && <div className="text-[10px] text-red-500 mt-1 font-semibold">Bạn đang đăng nhập</div>}
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleToggleLock(u.id, u.isLocked)}
                          disabled={u.id === currentUserId}
                          className={`p-2 rounded-lg transition-colors ${u.isLocked ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-600 hover:text-white' : 'text-gray-500 bg-gray-100 hover:bg-gray-600 hover:text-white'} ${u.id === currentUserId ? 'opacity-30 cursor-not-allowed' : ''}`}
                          title={u.isLocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                        >
                          {u.isLocked ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>}
                        </button>
                        <button onClick={() => { setEditingUser(u); setEditFormData({ name: u.name, phone: u.phone || "", password: "", oldPassword: "" }); }} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        </button>
                        <button onClick={() => handleDeleteUser(u.id)} disabled={u.id === currentUserId} className={`p-2 text-red-600 bg-red-50 rounded-lg transition-colors ${u.id === currentUserId ? 'opacity-30 cursor-not-allowed' : 'hover:bg-red-600 hover:text-white'}`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="px-8 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-sm text-slate-500 font-medium">Trang {currentPage} / {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 transition">Trước</button>
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 transition">Sau</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Chỉnh sửa thông tin */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Sửa thông tin người dùng</h2>
            <form onSubmit={handleSaveUserInfo} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Họ và tên *</label>
                <input type="text" required value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition font-medium text-slate-700" placeholder="Nhập họ tên" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Số điện thoại</label>
                <input type="text" maxLength={11} value={editFormData.phone} onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition font-medium text-slate-700" placeholder="VD: 0901234567" />
              </div>
              {editingUser.role === 'ADMIN' && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Mật khẩu hiện tại *</label>
                  <input type="password" value={editFormData.oldPassword} onChange={(e) => setEditFormData({ ...editFormData, oldPassword: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition font-medium text-slate-700" placeholder="Bắt buộc nhập nếu muốn đổi mật khẩu" />
                </div>
              )}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mật khẩu mới</label>
                <input type="password" value={editFormData.password} onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition font-medium text-slate-700" placeholder="Nhập mật khẩu mới (Nếu có)" />
                <p className="text-xs text-slate-500 mt-1 font-medium">Bỏ trống nếu không muốn đổi mật khẩu của người này.</p>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setEditingUser(null)} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition">Hủy bỏ</button>
                <button type="submit" disabled={isSaving} className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/30 disabled:opacity-50 flex justify-center items-center">
                  {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Thêm người dùng */}
      {isAddingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Thêm người dùng mới</h2>
            <form onSubmit={handleAddUser} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Họ và tên *</label>
                <input type="text" required value={addFormData.name} onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition font-medium text-slate-700" placeholder="Nhập họ tên" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email *</label>
                <input type="email" required value={addFormData.email} onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition font-medium text-slate-700" placeholder="Nhập địa chỉ email" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Số điện thoại</label>
                <input type="text" maxLength={11} value={addFormData.phone} onChange={(e) => setAddFormData({ ...addFormData, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition font-medium text-slate-700" placeholder="VD: 0901234567" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mật khẩu *</label>
                <input type="password" required value={addFormData.password} onChange={(e) => setAddFormData({ ...addFormData, password: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition font-medium text-slate-700" placeholder="Nhập mật khẩu (Ít nhất 6 ký tự)" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Vai trò *</label>
                <select value={addFormData.role} onChange={(e) => setAddFormData({ ...addFormData, role: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition font-medium text-slate-700 bg-white">
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsAddingUser(false)} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition">Hủy bỏ</button>
                <button type="submit" disabled={isAdding} className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/30 disabled:opacity-50 flex justify-center items-center">
                  {isAdding ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
