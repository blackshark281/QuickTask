const express = require("express");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

/**
 * @route   GET /api/users/me
 * @desc    Get logged-in user profile
 * @access  Private
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // exclude password
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @route   PUT /api/users/me
 * @desc    Update profile (name or password)
 * @access  Private
 */
router.put("/me", authMiddleware, async (req, res) => {
//   try {
//     const { name, password } = req.body;

//     let updateData = {};
//     if (name) updateData.name = name;

//     if (password) {
//       const salt = await bcrypt.genSalt(10);
//       updateData.password = await bcrypt.hash(password, salt);
//     }

//     const user = await User.findByIdAndUpdate(
//       req.user.id,
//       { $set: updateData },
//       { new: true }
//     ).select("-password");

//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }

try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    const { name, oldPassword, newPassword } = req.body;

    // Update name if provided
    if (name) {
      user.name = name;
    }

    // Update password if provided
    if (oldPassword && newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Old password is incorrect" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    res.json({ msg: "Profile updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
