const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/Product');
app.use('/products', productRoutes);

dotenv.config();
const app = express();

// تنظیمات میدل‌ورها
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// نمایش فایل‌های HTML و CSS از پوشه‌ی src
app.use(express.static(path.join(__dirname, 'src')));

// روت‌های API
app.use('/auth', authRoutes);
app.use('/api/products', productRoutes);

// اتصال به دیتابیس MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

// اجرای سرور
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
