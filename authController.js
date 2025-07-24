
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    // EmailJS via nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your_email@gmail.com',
        pass: 'your_gmail_app_password'
      }
    });

    await transporter.sendMail({
      from: 'teknogish',
      to: email,
      subject: 'خوش آمدید به teknogish',
      text: `سلام ${name}، ثبت‌نام شما با موفقیت انجام شد.`
    });

    res.json({ message: 'ثبت‌نام موفق' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'کاربر پیدا نشد' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'رمز اشتباه' });

    res.json({ message: 'ورود موفق', user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
