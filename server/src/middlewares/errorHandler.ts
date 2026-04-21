import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';


export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('🔥 [Error]:', err.stack || err.message);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  sendError(res, message, statusCode);
};