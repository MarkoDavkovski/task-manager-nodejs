import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
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
      from: process.env.EMAIL_FROM,
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
      from: process.env.EMAIL_FROM,
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

// sendEmail(
//   "recipient@example.com",
//   "Your Subject Here",
//   "Your plain text email body here",
//   "<h1>Welcome</h1><p>This is an HTML email body</p>"
// );

export { sendCancelationEmail, sendWelcomeEmail, sendEmail };
