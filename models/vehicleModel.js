const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  images: [{
    type: String,
    required: true,
  }],
  name: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['on sale', 'bought'],
    default: 'on sale',
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
