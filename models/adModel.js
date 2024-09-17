const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  adName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
    required: true,
  }],
  salePrice: {
    type: Number,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  bikeInfo: {
    model: { type: String, required: true },
    brand: { type: String, required: true },
    year: { type: Number, required: true },
    condition: { type: String, enum: ['new', 'used'], required: true },
    description: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ['on sale', 'sold'],
    default: 'on sale',
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Ad', adSchema);