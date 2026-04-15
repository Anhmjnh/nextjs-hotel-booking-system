"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

// Component Logo
const BrandLogo = () => (
  <div className="flex items-center gap-2">
    <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
      Booking
    </span>
  </div>
);

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      const token = Cookies.get("token");
      if (token) {
        setIsLoggedIn(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const navLinks = [
    { name: "Trang chủ", href: "/" },
    { name: "Khách sạn", href: "/hotels" },
    { name: "Ưu đãi độc quyền", href: "/offers" },
    { name: "Liên hệ", href: "/contact" },
  ];

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (pathname === href) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-8 xl:px-12">
        <div className="flex justify-between items-center h-24">
          <Link
            href="/"
            onClick={(e) => handleNavigation(e, "/")}
            className="flex-shrink-0 outline-none"
          >
            <BrandLogo />
          </Link>

          <nav className="hidden md:flex space-x-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavigation(e, link.href)}
                  className={`relative text-base font-bold tracking-wide transition-colors duration-300 outline-none py-2 group ${isActive
                      ? "text-blue-600"
                      : "text-slate-700 hover:text-blue-600"
                    }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
                  )}
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 rounded-full transition-all duration-300 ${isActive ? "" : "group-hover:w-full"}`}
                  ></span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            {!isMounted ? (
              <div className="w-32 h-12 bg-slate-100 animate-pulse rounded-full"></div>
            ) : isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/profile"
                  className="flex items-center justify-center w-12 h-12 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-full transition-colors duration-300 font-bold shadow-sm"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-full hover:bg-red-600 hover:text-white transition duration-300 shadow-sm border border-red-100"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-6 py-3 text-slate-700 font-bold hover:text-blue-600 transition"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 active:scale-95"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
