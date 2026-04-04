import { redirect } from "next/navigation";

export default function RoomsPage() {
  // Nếu vô tình truy cập /rooms (không có ID), tự động đẩy về Trang chủ
  redirect("/");
}