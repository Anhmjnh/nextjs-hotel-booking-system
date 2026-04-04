// Khởi chạy Server
import app from './app';
import dotenv from 'dotenv';

// Load các biến môi trường từ file .env
dotenv.config();

const PORT: number | string = process.env.PORT || 5000;

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
};

startServer();