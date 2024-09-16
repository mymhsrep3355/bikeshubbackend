const mongoose = require('mongoose');

const sparePartSchema = new mongoose.Schema({
  images: [{
    type: String,
    required: true,
  }],
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  usage: {
    type: String,
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('SparePart', sparePartSchema);
