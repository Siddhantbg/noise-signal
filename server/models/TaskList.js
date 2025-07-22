const mongoose = require('mongoose');

const TaskListSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['signal', 'noise'],
    required: true
  },
  items: [{
    text: String,
    completed: Boolean,
    createdAt: Date,
    images: [String] // Array of Cloudinary URLs
  }]
}, { timestamps: true });

module.exports = mongoose.model('TaskList', TaskListSchema);
