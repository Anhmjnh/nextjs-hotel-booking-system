"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-3xl font-black text-gray-900 tracking-tighter inline-block mb-6">
              Lux<span className="text-blue-600">Stay</span>.
            </Link>
            <p className="text-gray-500 font-medium leading-relaxed">
              Khám phá hàng ngàn không gian lưu trú sang trọng với mức giá tốt nhất cùng trải nghiệm đặt phòng mượt mà.
            </p>
          </div>
          
          <div>
            <h4 className="text-gray-900 font-bold mb-6 uppercase tracking-wider text-sm">Về chúng tôi</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-gray-500 hover:text-blue-600 font-medium transition">Cách hoạt động</Link></li>
              <li><Link href="/" className="text-gray-500 hover:text-blue-600 font-medium transition">Tin tức</Link></li>
              <li><Link href="/" className="text-gray-500 hover:text-blue-600 font-medium transition">Nhà đầu tư</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-bold mb-6 uppercase tracking-wider text-sm">Hỗ trợ</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-gray-500 hover:text-blue-600 font-medium transition">Trung tâm trợ giúp</Link></li>
              <li><Link href="/" className="text-gray-500 hover:text-blue-600 font-medium transition">Hủy phòng</Link></li>
              <li><Link href="/" className="text-gray-500 hover:text-blue-600 font-medium transition">Phản hồi</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-bold mb-6 uppercase tracking-wider text-sm">Liên hệ</h4>
            <ul className="space-y-4 text-gray-500 font-medium">
              <li> Địa Chỉ: Đường Âu Cơ,P10, Quận Tân Bình, TP.HCM</li>
              <li>Số Điện Thoại: 1900 123 456</li>
              <li>Email: support@luxstay.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 font-medium">&copy; {new Date().getFullYear()} LuxStay. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/" className="text-gray-400 hover:text-gray-900 transition font-medium">Facebook</Link>
            <Link href="/" className="text-gray-400 hover:text-gray-900 transition font-medium">Instagram</Link>
            <Link href="/" className="text-gray-400 hover:text-gray-900 transition font-medium">Twitter</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}