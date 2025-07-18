const mongoose = require('mongoose');

const CountdownSchema = new mongoose.Schema({
  targetTime: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Countdown', CountdownSchema);
