const User = require('../models/User');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const SECRET = 'myjwtsecret'; // می‌تونی هر چیزی بزاری یا از .env استفاده کنی

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existUser = await User.findOne({ email });
    if (existUser) return res.status(400).json({ error: 'ایمیل قبلاً استفاده شده است' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    // ارسال ایمیل با EmailJS
    await axios.post('https://api.emailjs.com/api/v1.0/email/send', {
      service_id: 'service_k2787c8',
      template_id: 'template_eyrr8ou',
      user_id: 'HxrJTFWRj9Hsyez-fytAw',
      template_params: {
        to_name: name,
        to_email: email,
        message: `سلام ${name}، ثبت‌نام شما با موفقیت انجام شد.`,
      },
    });

    const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '1h' });

    res.json({ message: 'ثبت‌نام موفق', token });
  } catch (err) {
    console.error('ثبت‌نام ناموفق:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'کاربر یافت نشد' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'رمز اشتباه است' });

    const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '1h' });

    res.json({ message: 'ورود موفق', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
      
