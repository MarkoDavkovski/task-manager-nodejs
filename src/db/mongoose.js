import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
  }
};

export default connectDB;
