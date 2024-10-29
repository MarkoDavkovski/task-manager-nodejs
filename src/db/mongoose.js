import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/task-manager-api");
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
  }
};

export default connectDB;
