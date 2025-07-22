
const express = require('express');
const router = express.Router();
const TaskList = require('../models/TaskList');
const upload = require('../multerCloudinary');

// Get list by type
router.get('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    let list = await TaskList.findOne({ type });
    
    if (!list) {
      list = new TaskList({ type, items: [] });
      await list.save();
    }
    
    res.json({ type: list.type, entries: list.items });
  } catch (err) {
    console.error('Error fetching list:', err);
    res.status(500).json({ error: 'Error fetching list' });
  }
});

// Add item to list (with image upload)
router.post('/:type', upload.array('images', 10), async (req, res) => {
  try {
    const { type } = req.params;
    const { text } = req.body;
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => file.path); // Cloudinary URL
    }

    let list = await TaskList.findOne({ type });
    if (!list) {
      list = new TaskList({ type, items: [] });
    }

    list.items.push({
      text,
      completed: false,
      createdAt: new Date(),
      images: imageUrls
    });

    await list.save();
    res.json({ type: list.type, entries: list.items });
  } catch (err) {
    console.error('Error adding item to list:', err);
    // Log full error details for debugging
    if (err instanceof Error) {
      console.error(err.stack);
    }
    res.status(500).json({ error: err.message || 'Error adding item to list', details: err });
  }
});

// Update item in list
router.put('/:type/:itemId', async (req, res) => {
  try {
    const { type, itemId } = req.params;
    const { completed, text } = req.body;
    
    const list = await TaskList.findOne({ type });
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }
    
    const item = list.items.id(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    if (completed !== undefined) item.completed = completed;
    if (text) item.text = text;
    await list.save();
    
    res.json({ type: list.type, entries: list.items });
  } catch (err) {
    console.error('Error updating item:', err);
    res.status(500).json({ error: 'Error updating item' });
  }
});

// Delete item from list
router.delete('/:type/:itemId', async (req, res) => {
  try {
    const { type, itemId } = req.params;
    
    const list = await TaskList.findOne({ type });
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }
    
    list.items.pull(itemId);
    await list.save();
    
    res.json({ type: list.type, entries: list.items });
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).json({ error: 'Error deleting item' });
  }
});

module.exports = router;
