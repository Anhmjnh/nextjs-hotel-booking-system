import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// Middleware kiểm tra quyền Admin ngay tại Backend
const isAdmin = (req: any, res: any, next: any) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Từ chối truy cập: Yêu cầu quyền Admin!' });
  }
};

router.get('/dashboard', verifyToken, isAdmin, adminController.getDashboardStats);

// Quản lý Phòng
router.get('/rooms', verifyToken, isAdmin, adminController.getRooms);
router.get('/rooms/:id', verifyToken, isAdmin, adminController.getRoomById);
router.post('/rooms', verifyToken, isAdmin, adminController.createRoom);
router.put('/rooms/:id', verifyToken, isAdmin, adminController.updateRoom);
router.delete('/rooms/:id', verifyToken, isAdmin, adminController.deleteRoom);

// Quản lý Đặt phòng
router.get('/bookings', verifyToken, isAdmin, adminController.getBookings);
router.put('/bookings/:id/status', verifyToken, isAdmin, adminController.updateBookingStatus);

// Quản lý Người dùng
router.get('/users', verifyToken, isAdmin, adminController.getUsers);
router.put('/users/:id/role', verifyToken, isAdmin, adminController.updateUserRole);
router.put('/users/:id', verifyToken, isAdmin, adminController.updateUserInfo);
router.delete('/users/:id', verifyToken, isAdmin, adminController.deleteUser);
router.put('/users/:id/lock', verifyToken, isAdmin, adminController.toggleUserLock);

// Quản lý Ưu đãi
router.get('/offers', verifyToken, isAdmin, adminController.getOffers);
router.post('/offers', verifyToken, isAdmin, adminController.createOffer);
router.put('/offers/:id', verifyToken, isAdmin, adminController.updateOffer);
router.delete('/offers/:id', verifyToken, isAdmin, adminController.deleteOffer);
// Quản lý Liên hệ
router.get('/contacts', adminController.getContacts);
router.put('/contacts/:id', adminController.updateContact);
router.delete('/contacts/:id', adminController.deleteContact);


export default router;