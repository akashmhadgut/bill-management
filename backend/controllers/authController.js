const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Login Controller
exports.login = async (req, res) => {
  try {
    console.log("Login API Hit"); // DEBUG

    const { email, password } = req.body;
    console.log("Email:", email); // DEBUG

    const user = await User.findOne({ email }).populate("department");
    console.log("User Found:", user); // DEBUG

    if (!user) {
      console.log("No user found with this email");
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match:", isMatch); // DEBUG

    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, department: user.department },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Token generated successfully");

    res.json({ message: "Login successful", token, user });

  } catch (error) {
    console.log("Login Error:", error);  // REAL ERROR HERE
    res.status(500).json({ message: "Server Error", error });
  }
};



// Admin Creates New User
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      department
    });

    res.json({ message: "User Created Successfully", newUser });
    try {
      const io = require('../utils/socket').getIo()
      io.emit('users:created', newUser)
    } catch (err) { console.warn('Socket emit failed on user create', err.message) }

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
