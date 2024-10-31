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

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
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

    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome Email sent: " + info.response);
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

    const info = await transporter.sendMail(mailOptions);
    console.log("Cancellation Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

export { sendCancelationEmail, sendWelcomeEmail, sendEmail };
