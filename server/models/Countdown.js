const mongoose = require('mongoose');


const CountdownSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  targetTime: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Countdown', CountdownSchema);
