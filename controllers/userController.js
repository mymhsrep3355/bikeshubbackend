const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const transporter = require("../config/mailer");
const Vehicle = require('../models/vehicleModel');
const SparePart = require('../models/sparePartModel');

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

    await newUser.save();


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


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id, user.userType);

    res.status(200).json({
      message: "Logged in successfully",
      user: {
        id: user._id,
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

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email } = req.body;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        userType: user.userType,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update profile', error });
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

    // Set the OTP verification status
    user.isOtpVerified = true;
    user.otp = undefined; 
    await user.save();

    res.status(200).json({ message: "OTP Verified. You can now reset your password." });
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

    if (!user.isOtpVerified) {
      return res.status(400).send({ message: "OTP not verified. Please verify OTP before resetting the password." });
    }

   
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.isOtpVerified = false; 
    await user.save();

    res.send({ message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "An error occurred", error });
  }
};


exports.addVehicleToWishlist = async (req, res) => {
    const { id: userId } = req.user; 
    const { vehicleId } = req.body;
  
    try {

      const user = await User.findById(userId);
      if (!user || user.userType !== 'buyer') {
        return res.status(403).json({ message: 'Only buyers can add to wishlist' });
      }
  
      const vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
  

      if (!user.wishlist.vehicles.includes(vehicleId)) {
        user.wishlist.vehicles.push(vehicleId);
        await user.save();
      }
  
      res.status(200).json({ message: 'Vehicle added to wishlist', wishlist: user.wishlist });
    } catch (error) {
      console.error('Error adding vehicle to wishlist:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  // Remove vehicle from wishlist
  exports.removeVehicleFromWishlist = async (req, res) => {
    const { id: userId } = req.user;
    const { vehicleId } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user || user.userType !== 'buyer') {
        return res.status(403).json({ message: 'Only buyers can remove from wishlist' });
      }
  
    
      user.wishlist.vehicles = user.wishlist.vehicles.filter(id => id.toString() !== vehicleId);
      await user.save();
  
      res.status(200).json({ message: 'Vehicle removed from wishlist', wishlist: user.wishlist });
    } catch (error) {
      console.error('Error removing vehicle from wishlist:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  // Add spare part to wishlist
  exports.addSparePartToWishlist = async (req, res) => {
    const { id: userId } = req.user;
    const { sparePartId } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user || user.userType !== 'buyer') {
        return res.status(403).json({ message: 'Only buyers can add to wishlist' });
      }
  
      const sparePart = await SparePart.findById(sparePartId);
      if (!sparePart) {
        return res.status(404).json({ message: 'Spare part not found' });
      }
  
      if (!user.wishlist.spareParts.includes(sparePartId)) {
        user.wishlist.spareParts.push(sparePartId);
        await user.save();
      }
  
      res.status(200).json({ message: 'Spare part added to wishlist', wishlist: user.wishlist });
    } catch (error) {
      console.error('Error adding spare part to wishlist:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  // Remove spare part from wishlist
  exports.removeSparePartFromWishlist = async (req, res) => {
    const { id: userId } = req.user;
    const { sparePartId } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user || user.userType !== 'buyer') {
        return res.status(403).json({ message: 'Only buyers can remove from wishlist' });
      }
  
      user.wishlist.spareParts = user.wishlist.spareParts.filter(id => id.toString() !== sparePartId);
      await user.save();
  
      res.status(200).json({ message: 'Spare part removed from wishlist', wishlist: user.wishlist });
    } catch (error) {
      console.error('Error removing spare part from wishlist:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };