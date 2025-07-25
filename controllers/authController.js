const User = require('../models/User');
const bcrypt = require('bcryptjs');
const axios = require('axios');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // بررسی اینکه فیلدها پر شده باشند
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'لطفاً همه فیلدها را پر کنید' });
  }

  try {
    // بررسی تکراری نبودن ایمیل
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'ایمیل قبلاً استفاده شده است' });
    }

    // هش کردن رمز عبور و ذخیره کاربر
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

    res.json({ message: 'ثبت‌نام با موفقیت انجام شد' });
  } catch (err) {
    console.error('خطا در ثبت‌نام:', err.message);
    res.status(500).json({ error: 'خطای سرور: ' + err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // بررسی اینکه فیلدها پر شده باشند
  if (!email || !password) {
    return res.status(400).json({ error: 'ایمیل و رمز عبور الزامی هستند' });
  }

  try {
    // پیدا کردن کاربر
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'کاربر یافت نشد' });

    // بررسی تطابق رمز
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'رمز عبور اشتباه است' });

    res.json({ message: 'ورود با موفقیت انجام شد' });
  } catch (err) {
    console.error('خطا در ورود:', err.message);
    res.status(500).json({ error: 'خطای سرور: ' + err.message });
  }
};
