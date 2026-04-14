import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// Cấu hình các đường dẫn cho Auth
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google', authController.googleLogin);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);


// Đường dẫn cần bảo vệ (Phải có Token mới vào được)
router.get('/me', verifyToken, authController.getMe);
router.put('/me', verifyToken, authController.updateMe);
router.put('/change-password', verifyToken, authController.changePassword);

export default router;