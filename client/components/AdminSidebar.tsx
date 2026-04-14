"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

// Component Logo đồng bộ với Header
const BrandLogo = () => (
    <div className="flex items-center gap-2 justify-center">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        </div>
        <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
        Booking
        </span>
    </div>
);

// Icon Solid chuyên nghiệp, khác biệt với nét viền (Outline) thông thường
const DashboardIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 13h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm-1 7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4zm10 0a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v7zm1-10h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1z"/></svg>;
const RoomIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.14 8.71a2.01 2.01 0 0 0-1.85-.71H14V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v15H3v2h18v-2h-1v-5l.14-7.29zM12 21H6v-6h6v6zm0-8H6v-2h6v2zm0-4H6V6h6v3zm6 12h-4v-4h2v-2h-2v-4h4v10z"/></svg>;
const BookingIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-2V2h-2v2H9V2H7v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5zm2 5h4v4H7v-4z"/></svg>;
const UserIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>;
const OfferIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M21 9h-6.2a4.49 4.49 0 0 0 .37-1.12C15.42 6.55 14.39 5 13 5c-.9 0-1.63.48-2 1.25C10.63 5.48 9.9 5 9 5 7.61 5 6.58 6.55 6.83 7.88c.1.37.23.75.37 1.12H1v4h20V9zm-2 2v10H3V11h16zm-7-4c0-.55.45-1 1-1s1 .45 1 1c0 1.6-1.64 2.54-3.14 2.81A4.27 4.27 0 0 0 12 7zm-4 0c0-.55.45-1 1-1s1 .45 1 1a4.27 4.27 0 0 0 2.14 2.81C9.64 9.54 8 8.6 8 7z"/></svg>;
const ContactIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>;

const navLinks = [
    { name: "Tổng quan", href: "/admin", icon: <DashboardIcon /> },
    { name: "Quản lý Phòng", href: "/admin/rooms", icon: <RoomIcon /> },
    { name: "Quản lý Đặt phòng", href: "/admin/bookings", icon: <BookingIcon /> },
    { name: "Quản lý Người dùng", href: "/admin/users", icon: <UserIcon /> },
    { name: "Quản lý Ưu đãi", href: "/admin/offers", icon: <OfferIcon /> },
    { name: "Quản lý Liên hệ", href: "/admin/contact", icon: <ContactIcon /> },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove("admin_token");
        window.location.href = "/login";
    };

    return (
        <aside className="w-64 bg-white text-slate-700 flex flex-col h-screen sticky top-0 border-r border-slate-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            <div className="h-24 flex items-center justify-center border-b border-slate-100">
                <Link href="/admin" className="outline-none hover:scale-105 transition-transform duration-200" title="Trang Tổng quan Admin">
                    <BrandLogo />
                </Link>
            </div>
            <nav className="flex-1 px-4 py-8 space-y-2">
                {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold ${isActive ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100/50" : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"}`}
                        >
                            {link.icon}
                            <span className="tracking-wide text-sm">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="p-6 border-t border-slate-100 space-y-2">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 hover:text-red-600 font-bold transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
                    <span className="text-sm">Đăng xuất Admin</span>
                </button>
            </div>
        </aside>
    );
}