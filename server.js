const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

dotenv.config();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// روت‌های API
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// اتصال به دیتابیس
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// صفحه اصلی سایت (فرانت)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
