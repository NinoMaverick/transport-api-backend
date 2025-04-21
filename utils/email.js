const nodemailer = require('nodemailer');

const sendPasswordResetEmail = async (email, resetURL) => {
  // Create a transporter object
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Define email options 
  const mailOptions = {
    from: 'Your App <noreply@yourapp.com>',
    to: email,
    subject: 'Password Reset (Valid for 10 minutes)',
    text: `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}\nIf you didn't forget your password, please ignore this email.`,
    html: `
      <h1>Password Reset</h1>
      <p>Forgot your password?</p>
      <p>Please click the link below to reset your password (valid for 10 minutes):</p>
      <a href="${resetURL}" target="_blank">Reset your password</a>
      <p>If you didn't forget your password, please ignore this email.</p>
    `
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = { sendPasswordResetEmail };