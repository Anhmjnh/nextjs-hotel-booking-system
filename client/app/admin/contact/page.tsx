"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import api from "../../../api";

interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State Modal chi tiết
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const fetchContacts = async () => {
    try {
      const token = Cookies.get("admin_token");
      const response = await api.get("/admin/contacts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.data) {
        setContacts(response.data.data);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách liên hệ!");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (id: number, currentStatus: boolean) => {
    try {
      const token = Cookies.get("admin_token");
      await api.put(`/admin/contacts/${id}`, { isRead: !currentStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Cập nhật trạng thái thành công!");
      setContacts(prev => prev.map(c => c.id === id ? { ...c, isRead: !currentStatus } : c));
      
      if (selectedContact && selectedContact.id === id) {
          setSelectedContact({ ...selectedContact, isRead: !currentStatus });
      }
    } catch (error) {
      toast.error("Cập nhật thất bại!");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tin nhắn này?")) return;
    try {
      const token = Cookies.get("admin_token");
      await api.delete(`/admin/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Xóa tin nhắn thành công!");
      setContacts(prev => prev.filter(c => c.id !== id));
      if (selectedContact && selectedContact.id === id) {
          setSelectedContact(null);
      }
    } catch (error) {
      toast.error("Xóa thất bại!");
    }
  };

  const handleViewDetails = async (contact: Contact) => {
      setSelectedContact(contact);
      // Nếu tin nhắn chưa đọc, khi click xem chi tiết sẽ tự động đánh dấu là đã đọc
      if (!contact.isRead) {
          await handleToggleRead(contact.id, contact.isRead);
      }
  }

  const filteredContacts = contacts.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || (statusFilter === "read" ? c.isRead : !c.isRead);
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const currentContacts = filteredContacts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <div className="flex justify-center items-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Quản lý Liên hệ</h1>
          <p className="text-slate-500 mt-2 font-medium">Xem và phản hồi tin nhắn từ khách hàng.</p>
        </div>
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex-1 relative">
           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
           </span>
           <input type="text" placeholder="Tìm theo tên, email, chủ đề..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition font-medium text-slate-700" />
        </div>
        <div className="w-full md:w-64">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-700 bg-white">
            <option value="all">Tất cả trạng thái</option>
            <option value="unread">Chưa đọc</option>
            <option value="read">Đã đọc</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Chủ đề</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày gửi</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-8 py-5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {currentContacts.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-12 text-center text-slate-500 font-medium">Không có liên hệ nào.</td></tr>
              ) : (
                currentContacts.map((c) => (
                  <tr key={c.id} className={`hover:bg-slate-50/80 transition duration-200 group ${!c.isRead ? 'bg-blue-50/30' : ''}`}>
                    <td className="px-8 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-900">{c.name}</div>
                      <div className="text-sm text-slate-500">{c.email}</div>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap">
                      <div className={`text-sm ${!c.isRead ? 'font-bold text-slate-900' : 'text-slate-700'}`}>{c.subject}</div>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(c.createdAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full cursor-pointer transition ${c.isRead ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`} onClick={() => handleToggleRead(c.id, c.isRead)}>
                        {c.isRead ? 'Đã đọc' : 'Chưa đọc'}
                      </span>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleViewDetails(c)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-colors">
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

      {/* Modal Xem chi tiết */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedContact.subject}</h2>
                <p className="text-slate-500 mt-1">Từ: <span className="font-bold text-slate-700">{selectedContact.name}</span> ({selectedContact.email})</p>
                <p className="text-xs text-slate-400 mt-1">{new Date(selectedContact.createdAt).toLocaleString("vi-VN")}</p>
              </div>
              <button onClick={() => setSelectedContact(null)} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8 whitespace-pre-wrap text-slate-700 font-medium leading-relaxed max-h-[50vh] overflow-y-auto">
              {selectedContact.message}
            </div>

            <div className="flex gap-4">
              <a 
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedContact.email}&su=${encodeURIComponent("Phản hồi: " + selectedContact.subject)}&body=${encodeURIComponent("\n\n\n---------------------------------\nTrích dẫn lời nhắn của bạn lúc " + new Date(selectedContact.createdAt).toLocaleString("vi-VN") + ":\n\n" + selectedContact.message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/30">
                Trả lời qua Web Gmail
              </a>
              <button onClick={() => handleDelete(selectedContact.id)} className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition">
                Xóa tin nhắn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}