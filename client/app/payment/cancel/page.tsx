import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg w-full max-w-md text-center border border-gray-100">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
          Đã hủy thanh toán
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Bạn đã hủy quá trình thanh toán. Đơn đặt phòng của bạn hiện đang ở
          trạng thái chờ. Vui lòng thử lại sau nếu bạn muốn tiếp tục đặt phòng.
        </p>
        <Link
          href="/"
          className="block w-full bg-gray-800 text-white font-bold py-3.5 rounded-xl hover:bg-gray-900 transition shadow-md"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
