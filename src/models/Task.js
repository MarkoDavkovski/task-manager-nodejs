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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

taskSchema.pre("save", function (next) {
  const task = this;
  /// middleware logic
  next();
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
