const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      // "helloEveryone@thiscannotbehacked#1#2#3", 
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
