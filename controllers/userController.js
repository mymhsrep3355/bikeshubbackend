const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const transporter = require("../config/mailer");


const generateToken = (id, userType) => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.signup = async (req, res) => {
  const { username, email, password, userType } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      userType,
    });

    // Save the user in the database
    await newUser.save();

    // Generate a token
    const token = generateToken(newUser._id, newUser.userType);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        username: newUser.username,
        email: newUser.email,
        userType: newUser.userType,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate a token
    const token = generateToken(user._id, user.userType);

    res.status(200).json({
      message: "Logged in successfully",
      user: {
        username: user.username,
        email: user.email,
        userType: user.userType,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    await user.save();
    await transporter.sendMail({
      from: process.env.GMAIL_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    });

    res.send({ message: "OTP sent to your email" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "An error occurred", error });
  }
};

exports.otpVerification = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email, otp });
    if (!user) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    res.status(200).json({ message: "OTP Verified" });
  } catch (error) {
    console.error("Error during OTP verification:", error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "Invalid email" });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = undefined; // Clear OTP after password reset
    await user.save();

    res.send({ message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "An error occurred", error });
  }
};
