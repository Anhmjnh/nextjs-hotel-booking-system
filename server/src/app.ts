// Cấu hình file App Express gốc
import express, { Application } from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import roomRoutes from './routes/room.routes';


const app: Application = express();

// Middlewares
app.use(cors());

// Webhook của Stripe cần body ở dạng Raw Buffer để xác thực chữ ký
app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/rooms', roomRoutes);


// Test route cơ bản
app.get('/', (req, res) => {
  res.send('Welcome to Hotel Booking API 🚀');
});

// Gắn toàn bộ Routes của ứng dụng (Thêm prefix /api/v1)
app.use('/api/v1', routes);

// Middleware xử lý lỗi tập trung (Bắt buộc phải nằm dưới cùng)
app.use(errorHandler);

export default app;