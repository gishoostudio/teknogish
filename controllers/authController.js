const User = require('../models/User');
const jwt = require('jsonwebtoken');
const emailjs = require('@emailjs/nodejs');

const OTP_STORE = new Map();

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: 'ایمیل قبلاً استفاده شده است' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  OTP_STORE.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 }); // 5 دقیقه

  try {
    await emailjs.send('service_k2787c8', 'template_eyrr8ou', {
      to_email: email,
      user_name: name,
      message: `کد تأیید شما: ${otp}`,
    }, {
      publicKey: 'HxrJTFWRj9Hsyez-fytAw',
    });

    res.json({ message: 'کد تأیید ارسال شد' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ارسال ایمیل با خطا مواجه شد' });
  }
};

exports.verify = async (req, res) => {
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

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.password !== password)
    return res.status(400).json({ error: 'ایمیل یا رمز نادرست است' });

  const token = jwt.sign({ id: user._id }, 'secret123', { expiresIn: '1d' });
  res.json({ message: 'ورود موفقیت‌آمیز بود', token });
};
