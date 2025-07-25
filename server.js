const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth.js');
const productRoutes = require('./routes/Product.js');

const app = express();
const PORT = process.env.PORT || 10000;

// اتصال به دیتابیس
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ اتصال به MongoDB موفق بود');
}).catch((err) => {
  console.error('❌ خطا در اتصال به MongoDB:', err.message);
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src')));

// روت‌های اصلی
app.use('/auth', authRoutes);
app.use('/api/products', productRoutes);

// روت پیش‌فرض برای صفحه اصلی و داشبورد
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'dashboard.html'));
});

// راه‌اندازی سرور
app.listen(PORT, () => {
  console.log(`🚀 سرور روی پورت ${PORT} در حال اجراست`);
});
