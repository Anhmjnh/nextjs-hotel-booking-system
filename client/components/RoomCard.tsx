/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

// Định nghĩa kiểu dữ liệu khớp với cấu trúc Database Prisma của bạn
export interface Room {
  id: number;
  name: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  type: string;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
}

export default function RoomCard({ room }: { room: Room }) {
  // Lấy ảnh đầu tiên trong mảng images làm ảnh đại diện, nếu mảng rỗng thì dùng ảnh mặc định
  const coverImage = room.images && room.images.length > 0 
    ? room.images[0] 
    : "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition duration-300 group flex flex-col h-full">
      <div className="h-56 bg-gray-200 overflow-hidden relative">
        <img src={coverImage} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-in-out" />
        {!room.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold px-4 py-2 bg-red-600 rounded-lg backdrop-blur-sm shadow-lg">Đã kín phòng</span>
          </div>
        )}
        <div className="absolute bottom-4 left-4 bg-blue-600/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-white shadow-sm uppercase tracking-wider">
          {room.type}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition line-clamp-1">{room.name}</h3>
        
        <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Tối đa {room.capacity} người
          </span>
        </div>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{room.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {room.amenities && room.amenities.slice(0, 3).map((amenity, index) => (
            <span key={index} className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-1 rounded-md font-medium">{amenity}</span>
          ))}
          {room.amenities && room.amenities.length > 3 && (
            <span className="text-xs bg-gray-100 text-gray-600 border border-gray-200 px-2 py-1 rounded-md">+{room.amenities.length - 3}</span>
          )}
        </div>

        <div className="flex justify-between items-end border-t border-gray-100 pt-4 mt-auto">
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Giá chỉ từ</p>
            <span className="text-2xl font-black text-blue-600">{room.pricePerNight.toLocaleString('vi-VN')}đ</span>
            <span className="text-gray-500 text-sm font-medium">/đêm</span>
          </div>
          <Link href={`/rooms/${room.id}`} className="bg-blue-50 text-blue-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition duration-200 shadow-sm">
            Chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
}