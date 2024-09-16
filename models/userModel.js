const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['buyer', 'seller'],
    required: true
  },
  otp: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
