// const express = require("express");
// const router = express.Router();
// const Task = require("../models/Task");
// const auth = require("../middleware/auth");

// // Create a new task
// router.post("/", auth, async (req, res) => {
//   try {
//     const { title, description, status, dueDate } = req.body;

//     const task = new Task({
//       title,
//       description,
//       status,
//       dueDate,
//       userId: req.user.id
//     });

//     await task.save();
//     res.json(task);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error " + err });
//   }
// });

// // Get all tasks for the logged-in user
// router.get("/", auth, async (req, res) => {
//   try {
//     const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
//     // res.json(tasks);
//     const today = new Date().setHours(0, 0, 0, 0);

//     const updatedTasks = tasks.map((task) => {
//       const due = task.dueDate ? new Date(task.dueDate).setHours(0, 0, 0, 0) : null;

//       let isOverdue = false;
//       if (due && due < today && task.status !== "Completed") {
//         isOverdue = true;
//       }

//       return {
//         ...task._doc,   // spread the mongoose doc into a plain object
//         isOverdue,      // add our custom flag
//       };
//     });

//     res.json(updatedTasks);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// // Update a task
// router.put("/:id", auth, async (req, res) => {
//   try {
//     let task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
//     if (!task) return res.status(404).json({ msg: "Task not found" });

//     const { title, description, status, dueDate } = req.body;

//     task.title = title || task.title;
//     task.description = description || task.description;
//     task.status = status || task.status;
//     task.dueDate = dueDate || task.dueDate;

//     await task.save();
//     res.json(task);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// // Delete a task
// router.delete("/:id", auth, async (req, res) => {
//   try {
//     const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
//     if (!task) return res.status(404).json({ msg: "Task not found" });

//     res.json({ msg: "Task deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const User = require("../models/User");   // 🔹 NEW for collaborators (to find user by email)
const auth = require("../middleware/auth");

// ================================
// Create a new task
// ================================
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

// ================================
// Get all tasks for the logged-in user
// ================================
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ $or : [{userId: req.user.id}, {"collaborators.userId": req.user.id}] }).populate({
      path: "collaborators.userId",
      select: "email"
    }).sort({ createdAt: -1 }); // 🔹 populate only email field
    
    const today = new Date().setHours(0, 0, 0, 0);

    const updatedTasks = tasks.map((task) => {
      const due = task.dueDate ? new Date(task.dueDate).setHours(0, 0, 0, 0) : null;

      let isOverdue = false;
      if (due && due < today && task.status !== "Completed") {
        isOverdue = true;
      }

      return {
        ...task._doc,
        isOverdue,
      };
    });

    res.json(updatedTasks);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// ================================
// Update a task
// ================================
router.put("/:id", auth, async (req, res) => {
  try {
    // let task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    let task = await Task.findOne({ _id: req.params.id});
    if (!task) return res.status(404).json({ msg: "Task not found" });

    // ✅ Permission check
    const isOwner = task.userId.toString() === req.user.id;
    const collaborator = task.collaborators.find(
      (c) => c.userId.toString() === req.user.id
    );

    if (!isOwner && (!collaborator || collaborator.role !== "editor")) {
      return res.status(403).json({ msg: "You don’t have permission to edit this task" });
    }

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

// ================================
// Delete a task
// ================================
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ msg: "Task not found" });

    res.json({ msg: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// ================================
// 🔹 NEW for collaborators
// ================================

// Add collaborator (only owner can do this)
router.post("/:id/collaborators", auth, async (req, res) => {
  try {
    const { email, role } = req.body; // role = "viewer" | "editor"
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: "Task not found" });
    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Only owner can add collaborators" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    // prevent duplicates
    if (task.collaborators.some(c => c.userId.toString() === user._id.toString())) {
      return res.status(400).json({ msg: "User already a collaborator" });
    }

    task.collaborators.push({ userId: user._id, role });
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: "Server error " + err.message });
  }
});

// Update collaborator role (only owner)
router.put("/:id/collaborators/:userId", auth, async (req, res) => {
  try {
    const { role } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: "Task not found" });
    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Only owner can update collaborator roles" });
    }

    const collaborator = task.collaborators.find(c => c.userId.toString() === req.params.userId);
    if (!collaborator) return res.status(404).json({ msg: "Collaborator not found" });

    collaborator.role = role;
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: "Server error " + err.message });
  }
});

// Remove collaborator (only owner)
router.delete("/:id/collaborators/:userId", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: "Task not found" });
    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Only owner can remove collaborators" });
    }

    task.collaborators = task.collaborators.filter(c => c.userId.toString() !== req.params.userId);
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: "Server error " + err.message });
  }
});

module.exports = router;
