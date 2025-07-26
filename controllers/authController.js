const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendVerificationEmail } = require('../utils/emailService');

const otps = {};

// ارسال OTP
exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otps[email] = otp;
  setTimeout(() => delete otps[email], 5 * 60 * 1000); // حذف بعد از ۵ دقیقه

  try {
    await sendVerificationEmail(email, otp);
    res.status(200).json({ message: 'کد تایید ارسال شد' });
  } catch (err) {
    res.status(500).json({ message: 'ارسال ایمیل ناموفق بود', error: err.message });
  }
};

// تأیید OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (otps[email] === otp) {
    delete otps[email];
    res.status(200).json({ message: 'کد تایید درست است' });
  } else {
    res.status(400).json({ message: 'کد تایید اشتباه است' });
  }
};
