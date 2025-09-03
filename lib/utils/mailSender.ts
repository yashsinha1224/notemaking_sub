import nodemailer from 'nodemailer';

// 1. Create the transporter OUTSIDE the function so it's reused.
// 2. Use the correct function name: createTransport (not createTransporter)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports (like 587)
  auth: {
    user: process.env.MAIL_USER, // Your Gmail address from .env
    pass: process.env.MAIL_PASS, // Your 16-digit App Password from .env
  },
});

const mailSender = async (email: string, title: string, body: string) => {
  try {
    
    const info = await transporter.sendMail({
      from: `"Your App Name" <${process.env.MAIL_USER}>`, 
      to: email,
      subject: title,
      html: body,
    });

    console.log('Email sent successfully: ', info.messageId);
    return info;
  } catch (error) {
    console.log('Error sending email: ', error);
    throw error; 
  }
};

export default mailSender;