import User from '../models/User.js';
import jwt from 'jsonwebtoken';
// ⚠️ اگر EmailJS رو از سمت کلاینت استفاده می‌کنی، خط زیر رو حذف کن:
// import emailjs from '@emailjs/nodejs';

const OTP_STORE = new Map();

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: 'ایمیل قبلاً استفاده شده است' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  OTP_STORE.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 }); // 5 دقیقه

  // اگر ارسال از کلاینت باشه، این بخش نیاز نیست:
  // await emailjs.send(...)

  res.json({ message: 'کد تأیید تولید شد (ارسال از سمت کاربر انجام شود)', otp });
};

export const verify = async (req, res) => {
  const { name, email, password, otp } = req.body;
  const record = OTP_STORE.get(email);

  if (!record || record.otp !== otp || record.expires < Date.now()) {
    return res.status(400).json({ error: 'کد تأیید نامعتبر یا منقضی شده' });
  }

  const user = new User({ name, email, password });
  await user.save();
  OTP_STORE.delete(email);

  res.json({ message: 'ثبت‌نام با موفقیت انجام شد' });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.password !== password)
    return res.status(400).json({ error: 'ایمیل یا رمز نادرست است' });

  const token = jwt.sign({ id: user._id }, 'secret123', { expiresIn: '1d' });
  res.json({ message: 'ورود موفقیت‌آمیز بود', token });
};
