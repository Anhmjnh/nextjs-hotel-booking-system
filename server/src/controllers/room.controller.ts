import { Request, Response, NextFunction } from 'express';
import * as roomService from '../services/room.service';
import { sendSuccess } from '../utils/response';

export const getAllRooms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rooms = await roomService.getAllRooms(req.query);
    sendSuccess(res, rooms, 'Lấy danh sách phòng thành công!');
  } catch (error: any) {
    next(error);
  }
};

export const getRoomById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roomId = req.params.id as string;
    const room = await roomService.getRoomById(roomId);
    sendSuccess(res, room, 'Lấy thông tin phòng thành công!');
  } catch (error: any) {
    next(error);
  }
};

export const getTopChoiceRooms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rooms = await roomService.getTopChoiceRooms();
    sendSuccess(res, rooms, 'Lấy danh sách phòng hàng đầu thành công!');
  } catch (error: any) {
    next(error);
  }
};

export const createReview = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.userId; // Lấy từ token
    const roomId = Number(req.params.id);
    const review = await roomService.createReview(userId, roomId, req.body);
    sendSuccess(res, review, 'Gửi đánh giá thành công!', 201);
  } catch (error: any) {
    next(error);
  }
};

export const updateReview = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.userId;
    const { reviewId } = req.params;
    const review = await roomService.updateReview(userId, Number(reviewId), req.body);
    sendSuccess(res, review, 'Cập nhật đánh giá thành công!');
  } catch (error: any) {
    next(error);
  }
};

export const deleteReview = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user; // Chứa userId và role
    const { reviewId } = req.params;
    await roomService.deleteReview(user, Number(reviewId));
    sendSuccess(res, null, 'Xóa đánh giá thành công!');
  } catch (error: any) {
    next(error);
  }
};

export const createRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roomData = req.body;
    const newRoom = await roomService.createRoom(roomData);
    sendSuccess(res, newRoom, 'Tạo phòng mới thành công!', 201);
  } catch (error: any) {
    next(error);
  }
};