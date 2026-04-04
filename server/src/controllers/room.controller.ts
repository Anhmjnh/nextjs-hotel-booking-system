import { Request, Response, NextFunction } from 'express';
import * as roomService from '../services/room.service';
import { sendSuccess } from '../utils/response';

export const getAllRooms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rooms = await roomService.getAllRooms();
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

export const createRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roomData = req.body;
    const newRoom = await roomService.createRoom(roomData);
    sendSuccess(res, newRoom, 'Tạo phòng mới thành công!', 201);
  } catch (error: any) {
    next(error);
  }
};