import mongoose from "mongoose";
import config from "../config/config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.db.url);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
  }
};

export default connectDB;
