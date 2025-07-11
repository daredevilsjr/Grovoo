const nodemailer = require("nodemailer");
require('dotenv').config();
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"1StopMandi Support" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.messageId);
  } catch (error) {
    console.error("Email send error: ", error);
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;
    