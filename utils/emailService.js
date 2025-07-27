const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'arans2870@gmail.com', // آدرس جیمیل شما
    pass: 'jxaulzzxmmjesroa'     // رمز عبور App (نه رمز اصلی جیمیل)
  }
});

const sendVerificationEmail = (to, otp) => {
  const mailOptions = {
    from: '"Teknogish" <arans2870@gmail.com>',
    to,
    subject: 'کد تایید فروشگاه Teknogish',
    html: `<h2>کد تایید شما:</h2><h1 style="color:#2ecc71;">${otp}</h1>`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('❌ خطا در ارسال ایمیل:', err);
    } else {
      console.log('📧 ایمیل با موفقیت ارسال شد:', info.response);
    }
  });
};

module.exports = { sendVerificationEmail };
