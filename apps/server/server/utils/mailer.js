const nodemailer = require('nodemailer');

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn('SMTP not configured. OTP emails will be printed to console.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(port) || 587,
    secure: false,
    auth: { user, pass },
  });
};

const sendMail = async ({ to, subject, text, html }) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('--- EMAIL (dev) ---');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Text:', text);
    console.log('HTML:', html);
    console.log('--- END EMAIL ---');
    return { ok: true, dev: true };
  }

  const info = await transporter.sendMail({ from: process.env.SMTP_USER, to, subject, text, html });
  return info;
};

module.exports = { sendMail };
