const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const JWT_SECRET = 'gish_teknogish_secret'; // می‌تونی اینو تو env بزاری

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'ایمیل قبلاً استفاده شده است' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

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

    res.json({ message: 'ثبت‌نام موفق' });
  } catch (err) {
    console.error('خطای ثبت‌نام:', err.message);
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

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: 'ورود موفق', token });
  } catch (err) {
    console.error('خطای ورود:', err.message);
    res.status(500).json({ error: err.message });
  }
};
      
