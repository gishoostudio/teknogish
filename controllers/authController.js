
const emailjs = require('@emailjs/nodejs');

const otpStore = {}; // In-memory store (move to DB in production)

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOTP = async (toEmail, otpCode) => {
  try {
    const response = await emailjs.send(
      'service_k2787c8',
      'template_eyrr8ou',
      {
        email: toEmail,
        otp: otpCode,
      },
      {
        publicKey: 'HxrJTFWRj9Hsyez-fytAw'
      }
    );
    console.log('OTP sent:', response.status);
    return true;
  } catch (err) {
    console.error('EmailJS Error:', err);
    return false;
  }
};

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  otpStore[email] = {
    code: otp,
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 min
  };
  const sent = await sendOTP(email, otp);
  if (sent) {
    res.status(200).json({ message: 'کد تایید ارسال شد' });
  } else {
    res.status(500).json({ message: 'ارسال کد تایید با خطا مواجه شد' });
  }
};

exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];
  if (!record) return res.status(400).json({ message: 'کدی ارسال نشده' });
  if (Date.now() > record.expiresAt) return res.status(400).json({ message: 'کد منقضی شده' });
  if (record.code !== otp) return res.status(400).json({ message: 'کد نادرست است' });
  delete otpStore[email];
  res.status(200).json({ message: 'کد تأیید شد' });
};
