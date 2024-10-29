import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    trim: true,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

taskSchema.pre("save", function () {
  const task = this;
  /// middleware logic
  next();
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
