

# BOOKING HOTEL - HỆ THỐNG ĐẶT PHÒNG KHÁCH SẠN

Booking Hotel là hệ thống website đặt phòng khách sạn được xây dựng theo kiến trúc Client - Server. Dự án cung cấp trải nghiệm đặt phòng cho người dùng và công cụ quản lý dành cho quản trị viên, tích hợp thanh toán trực tuyến và gửi email tự động.

---

## THÔNG TIN DỰ ÁN

Tên dự án: Booking Hotel
Công nghệ: Next.js, TypeScript, Node.js, Express, Prisma, PostgreSQL
Thư viện & API: Stripe, Cloudinary, Nodemailer, Google OAuth, JWT, Bcrypt
Mục đích: Đồ án
Tác giả: Anh Minh

---

## TÍNH NĂNG CHÍNH

### 2.1. Người dùng

* Đăng ký, đăng nhập, quên mật khẩu qua email
* Đăng nhập bằng Google (OAuth)
* Tìm kiếm phòng theo địa điểm, ngày check-in/check-out, số lượng người
* Tự động lọc các phòng đã bị đặt trùng lịch
* Xem chi tiết phòng (hình ảnh, mô tả, tiện ích)
* Đặt phòng và áp dụng mã giảm giá
* Thanh toán online qua Stripe hoặc thanh toán tại khách sạn
* Xem lịch sử đặt phòng
* Cập nhật thông tin cá nhân, đổi mật khẩu, avatar
* Đánh giá và bình luận sau khi hoàn thành chuyến đi

---

### 2.2. Quản trị viên 
  Tài khoản ADMIN:
  Email:minhkendy1902@gmail.com
  Pass:123456
* Dashboard thống kê người dùng, phòng, đơn đặt và doanh thu
* Quản lý phòng (thêm, sửa, xóa, cập nhật hình ảnh)
* Quản lý đơn đặt phòng (cập nhật trạng thái: Pending, Confirmed, Completed, Cancelled)
* Quản lý người dùng (phân quyền, khóa/mở tài khoản)
* Quản lý mã giảm giá
* Quản lý liên hệ từ khách hàng

---

## HƯỚNG DẪN CÀI ĐẶT

### 3.1. Chuẩn bị môi trường

* Node.js >= 18
* PostgreSQL
* Stripe CLI

---

### 3.2. Cài đặt thư viện

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

---

### 3.3. Cấu hình biến môi trường

Tạo file `.env` trong thư mục `server`:

```env
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/booking_hotel_db?schema=public"

JWT_SECRET="your_secret_key"

EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_app_password"

STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

CLOUDINARY_URL="cloudinary://..."
```

---

### 3.4. Khởi tạo database

```bash
npx prisma db push
npx prisma generate
```

---

### 3.5. Chạy dự án

```bash
# Backend
cd server
npm run dev

# Frontend
cd client
npm run dev
```

Backend: [http://localhost:5000](http://localhost:5000)
Frontend: [http://localhost:3000](http://localhost:3000)

---

### 3.6. Stripe Webhook (test local)

```bash
stripe listen --forward-to localhost:5000/api/v1/payments/webhook
```

---

## CẤU TRÚC THƯ MỤC

```
Booking_Hotel/
├── client/
├── server/
```

---

## LỖI THƯỜNG GẶP

* Không kết nối database → Sai DATABASE_URL
* Thanh toán không hoạt động → Sai STRIPE_SECRET_KEY hoặc chưa chạy webhook
* Không gửi được email → Sai EMAIL_USER hoặc EMAIL_PASS
* Không load ảnh → Sai cấu hình Cloudinary

---

## ĐỊNH HƯỚNG PHÁT TRIỂN

* Tách API thành microservices
* Tích hợp thêm nhiều phương thức thanh toán
* Tối ưu UI/UX
* Deploy production

---

## LICENSE

Dự án phục vụ mục đích học tập và nghiên cứu.

---
