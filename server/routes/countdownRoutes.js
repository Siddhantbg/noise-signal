const express = require('express');
const router = express.Router();
const Countdown = require('../models/Countdown');


// Get countdown for a user
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/countdown - Query params:', req.query);
    const { userId } = req.query;
    if (!userId) {
      console.log('Error: No userId provided in countdown GET');
      return res.status(400).json({ error: 'Missing userId' });
    }
    console.log('Looking for countdown for userId:', userId);
    const countdown = await Countdown.findOne({ userId }).sort({ createdAt: -1 });
    console.log('Countdown found:', countdown);
    res.json({ targetTime: countdown ? countdown.targetTime : null });
  } catch (err) {
    console.error('Error fetching countdown:', err);
    res.status(500).json({ error: 'Error fetching countdown' });
  }
});

// Update countdown for a user
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/countdown req.body:', req.body);
    const { userId, targetTime } = req.body;
    if (!userId) {
      console.log('Error: No userId provided in countdown POST');
      return res.status(400).json({ error: 'Missing userId' });
    }
    if (!targetTime) {
      console.log('Error: No targetTime provided in countdown POST');
      return res.status(400).json({ error: 'Missing targetTime' });
    }
    console.log('Looking for existing countdown for userId:', userId);
    let countdown = await Countdown.findOne({ userId });
    if (countdown) {
      console.log('Updating existing countdown');
      countdown.targetTime = targetTime;
      await countdown.save();
    } else {
      console.log('Creating new countdown');
      countdown = new Countdown({ userId, targetTime });
      await countdown.save();
    }
    console.log('Countdown saved successfully:', countdown);
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating countdown:', err);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).json({ error: 'Error updating countdown' });
  }
});

module.exports = router;
