const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// @route   GET api/backgrounds
// @desc    Get list of background images
// @access  Public
router.get('/', (req, res) => {
  const backgroundsDirPath = path.join(__dirname, '..', '..', 'client', 'public', 'backgrounds');

  fs.readdir(backgroundsDirPath, (err, files) => {
    if (err) {
      console.error('Error reading backgrounds directory:', err);
      return res.status(500).json({ msg: 'Server error' });
    }

    const imageFiles = files.filter(file => {
      const fileExtension = path.extname(file).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.svg', '.gif'].includes(fileExtension);
    });

    res.json(imageFiles.map(file => `backgrounds/${file}`));
  });
});

module.exports = router;