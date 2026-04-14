import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-[1400px] mx-auto px-8 xl:px-12 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 outline-none w-fit">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
                Booking
              </span>
            </Link>
            <p className="text-slate-500 font-medium leading-relaxed">
              Trải nghiệm không gian nghỉ dưỡng đẳng cấp, sang trọng và tiện nghi bậc nhất cho kỳ nghỉ của bạn.
            </p>
            <div className="flex items-center gap-4">
              {/* Nút Mạng xã hội */}
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
            </div>
          </div>

          {/* Cột 2: Khám phá */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-6">Khám phá</h3>
            <ul className="space-y-4">
              <li><Link href="/" className="text-slate-500 font-medium hover:text-blue-600 transition-colors">Trang chủ</Link></li>
              <li><Link href="/hotels" className="text-slate-500 font-medium hover:text-blue-600 transition-colors">Khách sạn</Link></li>
              <li><Link href="/offers" className="text-slate-500 font-medium hover:text-blue-600 transition-colors">Ưu đãi độc quyền</Link></li>
              <li><Link href="#" className="text-slate-500 font-medium hover:text-blue-600 transition-colors">Cẩm nang Du lịch</Link></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-6">Hỗ trợ khách hàng</h3>
            <ul className="space-y-4">
              <li><Link href="/contact" className="text-slate-500 font-medium hover:text-blue-600 transition-colors">Liên hệ</Link></li>
              <li><Link href="#" className="text-slate-500 font-medium hover:text-blue-600 transition-colors">Câu hỏi thường gặp</Link></li>
              <li><Link href="#" className="text-slate-500 font-medium hover:text-blue-600 transition-colors">Điều khoản dịch vụ</Link></li>
              <li><Link href="#" className="text-slate-500 font-medium hover:text-blue-600 transition-colors">Chính sách bảo mật</Link></li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-6">Thông tin liên hệ</h3>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span className="text-slate-500 font-medium">Đường Âu Cơ, Phường 10, Quận Tân Bình, TP.HCM</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <span className="text-slate-500 font-medium">support@booking.com</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <span className="text-slate-500 font-medium">1900 123 456</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Thanh bản quyền & Các phương thức thanh toán */}
        <div className="pt-8 border-t border-slate-200/60 flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 relative">
          <p className="text-slate-500 font-medium text-sm text-center md:absolute md:left-1/2 md:-translate-x-1/2">
             © {new Date().getFullYear()} Booking. All rights reserved.
          </p>
          
          <div className="hidden md:block"></div> {/* Box rỗng giữ chỗ bên trái trên Desktop để đẩy logo sang phải */}
          
          <div className="flex gap-4 items-center justify-center z-10">

            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 transition-transform duration-300 hover:scale-110 cursor-pointer" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/200px-PayPal.svg.png" alt="PayPal" className="h-5 transition-transform duration-300 hover:scale-110 cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
}
