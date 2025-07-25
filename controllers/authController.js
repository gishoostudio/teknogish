const User = require('../models/User');
const bcrypt = require('bcryptjs');
const axios = require('axios');

// ثبت‌نام کاربر
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // بررسی تکراری نبودن ایمیل
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'ایمیل قبلاً استفاده شده است' });
    }

    // هش کردن رمز عبور
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    // ارسال ایمیل تایید (اختیاری)
    try {
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
    } catch (emailErr) {
      console.error('❌ خطای ارسال ایمیل:', emailErr.message);
    }

    res.json({ message: 'ثبت‌نام موفق' });

  } catch (err) {
    console.error('❌ ثبت‌نام ناموفق:', err.message);
    res.status(500).json({ error: 'خطای سرور: ' + err.message });
  }
};

// ورود کاربر
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'کاربر یافت نشد' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'رمز عبور اشتباه است' });

    res.json({ message: 'ورود موفق' });

  } catch (err) {
    console.error('❌ خطای ورود:', err.message);
    res.status(500).json({ error: 'خطای سرور: ' + err.message });
  }
};
