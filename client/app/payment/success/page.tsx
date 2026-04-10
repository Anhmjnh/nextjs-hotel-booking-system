import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg w-full max-w-md text-center border border-gray-100">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
          Thanh toán thành công!
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Cảm ơn bạn đã sử dụng dịch vụ. Đơn đặt phòng của bạn đã được xác nhận
          và thanh toán hoàn tất.
        </p>
        <Link
          href="/"
          className="block w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition shadow-md"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
