const mongoose = require('mongoose');

const UserSettingsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  backgroundType: {
    type: String,
    enum: ['custom', 'predefined'],
  },
  backgroundValue: {
    type: String,
  },
});

module.exports = mongoose.model('UserSettings', UserSettingsSchema);