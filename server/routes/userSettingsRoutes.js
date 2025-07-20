const express = require('express');
const router = express.Router();
const UserSettings = require('../models/UserSettings');

// Get user settings
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/user/background - Query params:', req.query);
    
    const { userId } = req.query;
    if (!userId) {
      console.log('Error: No userId provided');
      return res.status(400).json({ msg: 'User ID is required' });
    }

    console.log('Looking for settings for userId:', userId);
    const settings = await UserSettings.findOne({ userId });
    
    if (!settings) {
      console.log('No settings found, creating default settings for userId:', userId);
      // If no settings, create default ones
      const defaultSettings = new UserSettings({
        userId,
        backgroundType: 'predefined',
        backgroundValue: ''
      });
      await defaultSettings.save();
      console.log('Default settings created:', defaultSettings);
      return res.json(defaultSettings);
    }

    console.log('Settings found:', settings);
    res.json(settings);
  } catch (err) {
    console.error('Error in GET /api/user/background:', err);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).json({ 
      error: 'Server Error',
      message: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Create or update user settings
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/user/background - Body:', req.body);
    
    const { userId, backgroundType, backgroundValue } = req.body;

    if (!userId) {
      return res.status(400).json({ msg: 'User ID is required' });
    }

    let settings = await UserSettings.findOne({ userId });

    if (settings) {
      console.log('Updating existing settings for userId:', userId);
      // Update
      settings.backgroundType = backgroundType;
      settings.backgroundValue = backgroundValue;
      await settings.save();
      console.log('Settings updated:', settings);
      return res.json(settings);
    }

    console.log('Creating new settings for userId:', userId);
    // Create
    settings = new UserSettings({
      userId,
      backgroundType,
      backgroundValue,
    });

    await settings.save();
    console.log('New settings created:', settings);
    res.json(settings);
  } catch (err) {
    console.error('Error in POST /api/user/background:', err);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).json({ 
      error: 'Server Error',
      message: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

module.exports = router;