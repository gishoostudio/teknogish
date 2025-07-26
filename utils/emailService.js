const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'arans2870@gmail.com',         // 👈 ایمیل مستقیم
    pass: 'jxaulzzxmmjesroa'             // 👈 اپ‌پسورد مستقیم
  }
});

function sendVerificationEmail(to, otp) {
  const mailOptions = {
    from: `"Teknogish" <arans2870@gmail.com>`,
    to,
    subject: 'کد تایید فروشگاه Teknogish',
    html: `
      <h2>کد تایید شما:</h2>
      <h1 style="color:#2ecc71;">${otp}</h1>
    `
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationEmail };
    
