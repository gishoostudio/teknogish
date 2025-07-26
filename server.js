import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/Product.js';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// برای __dirname در ESModule
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// اتصال به MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// میانی‌ها
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// فایل‌های استاتیک از مسیر src
app.use('/src', express.static(path.join(__dirname, 'src')));

// نمایش index.html در مسیر root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// مسیرهای API
app.use('/auth', authRoutes);
app.use('/api/products', productRoutes);

// اجرای سرور
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
