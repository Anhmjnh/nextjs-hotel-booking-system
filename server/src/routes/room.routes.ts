import { Router } from 'express';
import * as roomController from '../controllers/room.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// Route lấy tất cả phòng 
router.get('/', roomController.getAllRooms);

// Route lấy phòng hàng đầu cho trang chủ 
router.get('/top-choices', roomController.getTopChoiceRooms);

// Route lấy chi tiết 1 phòng
router.get('/:id', roomController.getRoomById);

// Route để user đăng review cho phòng
router.post('/:id/reviews', verifyToken, roomController.createReview);

// Routes để user sửa/xóa review của chính mình (hoặc admin xóa)
router.put('/:id/reviews/:reviewId', verifyToken, roomController.updateReview);
router.delete('/:id/reviews/:reviewId', verifyToken, roomController.deleteReview);

//  route dành cho admin
router.post('/', verifyToken, roomController.createRoom);

export default router;