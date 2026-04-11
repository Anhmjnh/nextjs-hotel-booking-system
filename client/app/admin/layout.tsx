import AdminSidebar from "../../components/AdminSidebar";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Thanh Header trên cùng của Admin */}
        <header className="h-24 bg-white border-b border-slate-100 flex items-center justify-end px-10 sticky top-0 z-10 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
          <Link href="/admin/profile" className="flex items-center gap-3 hover:bg-slate-50 p-2 pr-5 rounded-full border border-slate-100 shadow-sm transition group outline-none">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-700 leading-tight">Quản trị viên</p>
              <p className="text-xs text-slate-500 font-medium group-hover:text-blue-600 transition-colors">Hồ sơ & Bảo mật</p>
            </div>
          </Link>
        </header>
        <main className="flex-1 p-10">{children}</main>
      </div>
    </div>
  );
}
