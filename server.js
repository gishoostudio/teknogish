const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/Product');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// اتصال به MongoDB Atlas
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

// مسیر پیش‌فرض به index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// مسیرها
app.use('/auth', authRoutes);
app.use('/api/products', productRoutes);

// راه‌اندازی سرور
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
