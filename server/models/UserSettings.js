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
    default: 'predefined' // Add default value
  },
  backgroundValue: {
    type: String,
    default: '' // Add default value
  },
}, {
  timestamps: true // Optional: adds createdAt and updatedAt
});

module.exports = mongoose.model('UserSettings', UserSettingsSchema);