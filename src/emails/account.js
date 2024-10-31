import nodemailer from "nodemailer";
import config from "../config/config.js";

const { host, port, secure, auth, from } = config.smtp;

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: {
    user: auth.user,
    pass: auth.pass,
  },
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from,
      to,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

const sendWelcomeEmail = async (email, name) => {
  try {
    const mailOptions = {
      from,
      to: email,
      subject: "Thanks for joining.",
      text: `Welcome to the app, ${name}. Let me know how you get along with the app!`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};
const sendCancelationEmail = async (email, name) => {
  try {
    const mailOptions = {
      from,
      to: email,
      subject: "Sorry to see you go.",
      text: `Goodbye, ${name}. I hope to see you back sometime soon!`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

export { sendCancelationEmail, sendWelcomeEmail, sendEmail };
