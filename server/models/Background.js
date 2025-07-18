const mongoose = require('mongoose');

const BackgroundSchema = new mongoose.Schema({
  imageData: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Background', BackgroundSchema);
