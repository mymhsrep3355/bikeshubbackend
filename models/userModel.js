
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ['buyer', 'seller'],
    required: true,
  },
  otp: {
    type: String,
  },
  wishlist: {
    vehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }],
    spareParts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SparePart' }],
  },
  cart: {
    vehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }],
    spareParts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SparePart' }],
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
