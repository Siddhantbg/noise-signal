const express = require('express');
const router = express.Router();
const Countdown = require('../models/Countdown');

// Get countdown
router.get('/', async (req, res) => {
  try {
    const countdown = await Countdown.findOne().sort({ createdAt: -1 });
    res.json({ targetTime: countdown ? countdown.targetTime : null });
  } catch (err) {
    console.error('Error fetching countdown:', err);
    res.status(500).json({ error: 'Error fetching countdown' });
  }
});

// Update countdown
router.post('/', async (req, res) => {
  try {
    const { targetTime } = req.body;
    const countdown = new Countdown({ targetTime });
    await countdown.save();
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating countdown:', err);
    res.status(500).json({ error: 'Error updating countdown' });
  }
});

module.exports = router;
