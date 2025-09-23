const Task = require("../models/Task");

// Check if user is owner
const isOwner = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only owner can perform this action" });
    }

    req.task = task; // attach task for later use
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Check if user is at least editor (can edit but not delete)
const canEdit = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const userId = req.user.id;

    if (task.userId.toString() === userId) {
      req.task = task;
      return next(); // owner
    }

    const collaborator = task.collaborators.find(
      (c) => c.userId.toString() === userId
    );

    if (!collaborator || collaborator.role !== "editor") {
      return res.status(403).json({ message: "Permission denied" });
    }

    req.task = task;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Check if user can at least view
const canView = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const userId = req.user.id;

    if (task.userId.toString() === userId) {
      req.task = task;
      return next(); // owner
    }

    const collaborator = task.collaborators.find(
      (c) => c.userId.toString() === userId
    );

    if (!collaborator) {
      return res.status(403).json({ message: "Permission denied" });
    }

    req.task = task;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { isOwner, canEdit, canView };
