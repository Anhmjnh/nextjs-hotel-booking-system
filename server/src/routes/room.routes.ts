import { Router } from 'express';
import * as roomController from '../controllers/room.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// Public Routes: Khách vãng lai chưa đăng nhập vẫn xem được danh sách phòng
router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);

// Protected Routes: Phải là người của hệ thống (có Token) mới được thêm phòng
router.post('/', verifyToken, roomController.createRoom);

export default router;