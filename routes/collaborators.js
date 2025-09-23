const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { isOwner } = require("../middleware/permissions");

// ✅ Add collaborator
router.post("/:id/collaborators", isOwner, async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!["viewer", "editor"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Avoid duplicate collaborator
    if (req.task.collaborators.some((c) => c.userId.toString() === userId)) {
      return res.status(400).json({ message: "User already a collaborator" });
    }

    req.task.collaborators.push({ userId, role });
    await req.task.save();

    res.status(201).json({ message: "Collaborator added", task: req.task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update collaborator role
router.put("/:id/collaborators/:userId", isOwner, async (req, res) => {
  try {
    const { role } = req.body;

    if (!["viewer", "editor"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const collaborator = req.task.collaborators.find(
      (c) => c.userId.toString() === req.params.userId
    );

    if (!collaborator) {
      return res.status(404).json({ message: "Collaborator not found" });
    }

    collaborator.role = role;
    await req.task.save();

    res.json({ message: "Collaborator role updated", task: req.task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Remove collaborator
router.delete("/:id/collaborators/:userId", isOwner, async (req, res) => {
  try {
    req.task.collaborators = req.task.collaborators.filter(
      (c) => c.userId.toString() !== req.params.userId
    );

    await req.task.save();
    res.json({ message: "Collaborator removed", task: req.task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
