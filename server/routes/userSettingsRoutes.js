const express = require('express');
const router = express.Router();
const UserSettings = require('../models/UserSettings');

// Get user settings
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ msg: 'User ID is required' });
    }
    const settings = await UserSettings.findOne({ userId });
    if (!settings) {
      // If no settings, create default ones
      const defaultSettings = new UserSettings({
        userId,
        backgroundType: 'default',
        backgroundValue: ''
      });
      await defaultSettings.save();
      return res.json(defaultSettings);
    }
    res.json(settings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create or update user settings
router.post('/', async (req, res) => {
  const { userId, backgroundType, backgroundValue } = req.body;

  try {
    let settings = await UserSettings.findOne({ userId });

    if (settings) {
      // Update
      settings.backgroundType = backgroundType;
      settings.backgroundValue = backgroundValue;
      await settings.save();
      return res.json(settings);
    }

    // Create
    settings = new UserSettings({
      userId,
      backgroundType,
      backgroundValue,
    });

    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;