import "./css/globals.css"; // Nhúng Tailwind CSS từ thư mục css
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Booking Hotel - Đặt phòng dễ dàng",
  description: "Hệ thống đặt phòng khách sạn hiện đại và tiện lợi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        {children}
        {/* Nhúng bộ hiển thị thông báo góc trên bên phải cho toàn bộ App */}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}