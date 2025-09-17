const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// Create a new task
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    const task = new Task({
      title,
      description,
      status,
      dueDate,
      userId: req.user.id
    });

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: "Server error " + err });
  }
});

// Get all tasks for the logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    // res.json(tasks);
    const today = new Date().setHours(0, 0, 0, 0);

    const updatedTasks = tasks.map((task) => {
      const due = task.dueDate ? new Date(task.dueDate).setHours(0, 0, 0, 0) : null;

      let isOverdue = false;
      if (due && due < today && task.status !== "Completed") {
        isOverdue = true;
      }

      return {
        ...task._doc,   // spread the mongoose doc into a plain object
        isOverdue,      // add our custom flag
      };
    });

    res.json(updatedTasks);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Update a task
router.put("/:id", auth, async (req, res) => {
  try {
    let task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ msg: "Task not found" });

    const { title, description, status, dueDate } = req.body;

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.dueDate = dueDate || task.dueDate;

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete a task
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ msg: "Task not found" });

    res.json({ msg: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
