const express = require('express');
const router = express.Router();
const Background = require('../models/Background');

// Get background
router.get('/', async (req, res) => {
  try {
    const background = await Background.findOne().sort({ createdAt: -1 });
    res.json({ imageData: background ? background.imageData : null });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching background' });
  }
});

// Update background
router.post('/', async (req, res) => {
  try {
    const { imageData } = req.body;
    const background = new Background({ imageData });
    await background.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error updating background' });
  }
});

// Delete background
router.delete('/', async (req, res) => {
  try {
    await Background.deleteMany({});
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting background' });
  }
});

module.exports = router;
