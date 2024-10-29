import express from "express";
import Task from "../models/Task.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/tasks", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id });
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) return res.status(404).send("Task not found.");
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid updates!" });

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) return res.status(404).send("Task not found.");
    updates.forEach((update) => {
      task[update] = req.body[update];
    });
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) return res.status(404).send("Task not found.");
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
