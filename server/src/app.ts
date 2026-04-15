// Cấu hình file App Express gốc
import express, { Application } from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import contactRoutes from './routes/contact.routes';
import paymentRoutes from './routes/payment.routes';
const app: Application = express();

// Middlewares
app.use(cors());

// Đăng ký Payment Routes 
app.use('/api/v1/payments', paymentRoutes);

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


// Test route cơ bản
app.get('/', (req, res) => {
  res.send('Welcome to Hotel Booking API 🚀');
});

// Gắn toàn bộ Routes của ứng dụng 
app.use('/api/v1', routes);

// Middleware xử lý lỗi tập trung 
app.use(errorHandler);

app.use('/api/v1/contacts', contactRoutes);

export default app;