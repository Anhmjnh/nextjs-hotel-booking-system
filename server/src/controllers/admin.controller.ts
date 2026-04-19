import { Response, NextFunction } from 'express';
import * as adminService from '../services/admin.service';
import * as offerService from '../services/offer.service';
import { sendSuccess } from '../utils/response';


export const getDashboardStats = async (req: any, res: Response, next: NextFunction) => {
  try {
    const stats = await adminService.getDashboardStats();
    sendSuccess(res, stats, 'Lấy thống kê thành công!');
  } catch (error: any) {
    next(error);
  }
};

// --- QUẢN LÝ ƯU ĐÃI (OFFERS) ---
export const getOffers = async (req: any, res: Response, next: NextFunction) => {
  try {
    const offers = await offerService.getAllOffers();
    sendSuccess(res, offers, 'Lấy danh sách ưu đãi thành công!');
  } catch (error: any) {
    next(error);
  }
};

export const createOffer = async (req: any, res: Response, next: NextFunction) => {
  try {
    const offer = await offerService.createOffer(req.body);
    sendSuccess(res, offer, 'Tạo ưu đãi thành công!', 201);
  } catch (error: any) {
    next(error);
  }
};

export const updateOffer = async (req: any, res: Response, next: NextFunction) => {
  try {
    const offer = await offerService.updateOffer(Number(req.params.id), req.body);
    sendSuccess(res, offer, 'Cập nhật ưu đãi thành công!');
  } catch (error: any) {
    next(error);
  }
};

export const deleteOffer = async (req: any, res: Response, next: NextFunction) => {
  try {
    await offerService.deleteOffer(Number(req.params.id));
    sendSuccess(res, null, 'Xóa ưu đãi thành công!');
  } catch (error: any) {
    next(error);
  }
};

export const toggleUserLock = async (req: any, res: Response, next: NextFunction) => {
  try {
    const adminId = req.user.userId;
    const targetUserId = Number(req.params.id);
    const user = await adminService.toggleUserLock(adminId, targetUserId);
    const message = user.isLocked ? 'Khóa tài khoản thành công!' : 'Mở khóa tài khoản thành công!';
    sendSuccess(res, user, message);
  } catch (error: any) {
    next(error);
  }
};

export const getRooms = async (req: any, res: Response, next: NextFunction) => {
  try {
    const rooms = await adminService.getAdminRooms();
    sendSuccess(res, rooms, 'Lấy danh sách phòng thành công!');
  } catch (error: any) {
    next(error);
  }
};

export const deleteRoom = async (req: any, res: Response, next: NextFunction) => {
  try {
    await adminService.deleteRoom(Number(req.params.id));
    sendSuccess(res, null, 'Xóa phòng thành công!');
  } catch (error: any) {
    next(error);
  }
};

export const getRoomById = async (req: any, res: Response, next: NextFunction) => {
  try {
    const room = await adminService.getAdminRoomById(Number(req.params.id));
    sendSuccess(res, room, 'Lấy thông tin phòng thành công!');
  } catch (error: any) {
    next(error);
  }
};

export const createRoom = async (req: any, res: Response, next: NextFunction) => {
  try {
    const room = await adminService.createRoom(req.body);
    sendSuccess(res, room, 'Thêm phòng thành công!', 201);
  } catch (error: any) {
    next(error);
  }
};

export const updateRoom = async (req: any, res: Response, next: NextFunction) => {
  try {
    const room = await adminService.updateRoom(Number(req.params.id), req.body);
    sendSuccess(res, room, 'Cập nhật phòng thành công!');
  } catch (error: any) {
    next(error);
  }
};

export const getBookings = async (req: any, res: Response, next: NextFunction) => {
  try {
    const bookings = await adminService.getAdminBookings();
    sendSuccess(res, bookings, 'Lấy danh sách đơn đặt phòng thành công!');
  } catch (error: any) {
    next(error);
  }
};

export const updateBookingStatus = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const booking = await adminService.updateBookingStatus(Number(req.params.id), status);
    sendSuccess(res, booking, 'Cập nhật trạng thái thành công!');
  } catch (error: any) {
    next(error);
  }
};

export const getUsers = async (req: any, res: Response, next: NextFunction) => {
  try {
    const users = await adminService.getAdminUsers();
    sendSuccess(res, users, 'Lấy danh sách người dùng thành công!');
  } catch (error: any) {
    next(error);
  }
};
export const createUser = async (req: any, res: Response) => {
  try {
    const adminId = req.user.userId;
    const user = await adminService.createUser(adminId, req.body);
    res.status(201).json({ message: "Thêm người dùng thành công!", data: user });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUserRole = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { role } = req.body;
    const adminId = req.user.userId; // Lấy từ token qua verifyToken
    const user = await adminService.updateUserRole(adminId, Number(req.params.id), role);
    sendSuccess(res, user, 'Cập nhật phân quyền thành công!');
  } catch (error: any) {
    next(error);
  }
};

export const updateUserInfo = async (req: any, res: Response, next: NextFunction) => {
  try {
    const adminId = req.user.userId;
    const user = await adminService.updateUserInfo(adminId, Number(req.params.id), req.body);
    sendSuccess(res, user, 'Cập nhật thông tin thành công!');
  } catch (error: any) {
    next(error);
  }
};

export const deleteUser = async (req: any, res: Response, next: NextFunction) => {
  try {
    const adminId = req.user.userId;
    await adminService.deleteUser(adminId, Number(req.params.id));
    sendSuccess(res, null, 'Xóa người dùng thành công!');
  } catch (error: any) {
    next(error);
  }
};
export const getContacts = async (req: any, res: Response, next: NextFunction) => {
  try {
    const contacts = await adminService.getAdminContacts();
    sendSuccess(res, contacts, "Lấy danh sách liên hệ thành công!");
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req: any, res: Response, next: NextFunction) => {
  try {
    const contactId = Number(req.params.id);
    const updatedContact = await adminService.updateContactStatus(contactId, req.body);
    sendSuccess(res, updatedContact, "Cập nhật liên hệ thành công!");
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req: any, res: Response, next: NextFunction) => {
  try {
    const contactId = Number(req.params.id);
    await adminService.deleteContact(contactId);
    sendSuccess(res, null, "Xóa liên hệ thành công!");
  } catch (error) {
    next(error);
  }
};
