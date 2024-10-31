import dotenv from "dotenv";

const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });

export default {
  env,
  port: process.env.PORT || 3000,
  jwtSecretKey: process.env.JWT_SECRET_KEY,

  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true", // convert to boolean
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    from: process.env.EMAIL_FROM,
  },

  db: {
    url: process.env.MONGO_DB_URL,
  },
};
